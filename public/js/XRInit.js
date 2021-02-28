import { WebXRButton } from './util/webxr-button.js';
import { InlineViewerHelper } from './util/inline-viewer-helper.js';
import { QueryArgs } from './util/query-args.js';
import { Renderer, createWebGLContext } from './render/core/renderer.js';
import { Scene } from './render/scenes/scene.js';
import { SkyboxNode } from './render/nodes/skybox.js'
import { Gltf2Node } from './render/nodes/gltf2.js';
import WebXRPolyfill from './third-party/webxr-polyfill/build/webxr-polyfill.module.js';

if (QueryArgs.getBool('usePolyfill', true)) {
    const polyfill = new WebXRPolyfill();
}

let Parent = null;
let XRButton = null;
let XRImmersiveRefSpace = null;
let _InlineViewerHelper = null;
let GL = null;
let _Renderer = null;
let _Scene = new Scene();
let SolarSystem = new Gltf2Node({ url: '' });

SolarSystem.scale = [ .1, .1, .1 ];
_Scene.addNode(SolarSystem);

let SkyBox = new SkyboxNode({ url: '' });
_Scene.addNode(SkyBox);

import { WebGLRenderer, XRWebGLLayer } from 'three';

let device, session;

async function InitializeXR(elem) {
    Parent = elem;
    XRButton = new WebXRButton({
        onRequestSession:       OnRequestSession,
        onSessionEnd:           OnEndSession,
        textEnterXRTitle:       'START AR',
        textExitXRTitle:        'EXIT AR',
        textXRNotFoundTitle:    'AR NOT FOUND'
    });
    Parent.append(XRButton.domElement);

    if ('xr' in navigator) {
        let _;
        navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => _ = supported);
        XRButton.enabled = _;

        navigator.xr.requestSession('inline').then(OnSessionStarted);
    }
}

function OnRequestSession() {
    return navigator.xr.onRequestSession('immersive-ar')
    .then(session => {
        XRButton.setSession(session);
        session.isImmersive = true;
        OnSessionStarted(session);
    });
}

function InitGL() {
    if (GL) return;

    GL = createWebGLContext({ xrCompatible: true });
    Parent.append(GL.canvas);

    function OnResize() {
        GL.canvas.width = GL.canvas.clientWidth * window.devicePixelRatio;
        GL.canvas.height = GL.canvas.clientHeight * window.devicePixelRatio;
    }

    window.addEventListener('resize', OnResize);
    OnResize();

    _Renderer = new Renderer(GL);
    _Scene.setRenderer(_Renderer);
}

function OnSessionStarted(session) {
    session.addEventListener('end', OnSessionEnded);
    if (session.isImmersive) {
        SkyBox.visible = false;
    }

    InitGL();
    session.updateRenderState({ baseLayer: new XRWebGLLayer(session, GL) });

    let RefSpaceType = session.isImmersive ? 'local' : 'viewer';
    session.requestReferenceSpace(RefSpaceType)
    .then(function(ref) {
        if (session.isImmersive) {
            XRImmersiveRefSpace = ref;
        } else {
            _InlineViewerHelper = new InlineViewerHelper(GL.canvas, ref);
        }
        
        session.requestAnimationFrame(onXRFrame);
    });    
}

function OnEndSession(session) {
    session.end();
}

function OnSessionEnded(ev) {
    if (ev.session.isImmersive) {
        XRButton.setSession(null);
        SkyBox.visible = true;
    }
}

function onXRFrame(time, frame) {
    const session = frame.session;
    const refSpace = session.isImmersive ? XRImmersiveRefSpace : InlineViewerHelper.referenceSpace;
    const pose = frame.getViewerPose(refSpace);
    
    _Scene.startFrame();
    session.requestAnimationFrame(onXRFrame);
    _Scene.drawXRFrame(frame, pose);
    _Scene.endFrame();
}

export { InitializeXR as XRInit };