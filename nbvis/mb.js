// -- configure mathbox -- //
var mathbox = mathBox({
    plugins: ['core', 'controls', 'cursor', 'mathbox'],
    controls: { klass: THREE.OrbitControls },
    mathbox: { inspect: false },
    
    // -- wraps canvas to respect cell padding -- //
    element: element[0].firstChild, // element[0].appendChild(document.createElement("div")),
    
    loop: { start: false }
});

// -- configure three.js bootstrap -- //
var three = mathbox.three;
three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);
three.camera.position.set(-1, 1, 2);
three.controls.noKeys = true;

three.element.style.width = "100%";
three.element.style.height = d3.select(element[0].firstChild).attr('height').toString() + 'px';

// -- resize window -- //
window.dispatchEvent(new Event('resize'));

// -- check if element is visible -- //
function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    var html = document.documentElement;
    var w = window.innerWidth || html.clientWidth;
    var h = window.innerHeight || html.clientHeight;
    return rect.top < h && rect.left < w && rect.bottom > 0 && rect.right > 0;
}

// -- run update/render loop only for visible plots -- //
document.getElementById('site').onscroll = (e) => {
    if (three.element.offsetParent === null) {
        three.destroy();
        return;
    }
    var visible = isInViewport(three.canvas);
    if (three.Loop.running != visible) {
        visible ? three.Loop.start() : three.Loop.stop();
    }
}

three.Loop.start();