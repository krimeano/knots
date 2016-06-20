"use strict";

var LA = LinealAlgebra;

class Celtic {

    get style() {
        return {
            fill: '#888'
        }
    }

    get config() {
        return {
            id: "myCanvas"
        }
    }

    constructor() {
        this.canvas = document.getElementById(this.config.id);
        this.ctx = this.canvas.getContext("2d");
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.center = {
            x: Math.floor(this.w / 2),
            y: Math.floor(this.h / 2)
        };
        this.initData().draw();
        //this.fillBg();

    }

    initData() {
        this.coordinates = [[200, 200], [400, 200], [400, 400], [200, 400]];
        this.lines = [[0, 1], [1, 2]];
        this.points = this.coordinates.map(x=>new Celtic.Point(this, x));
        this.vectors = [];
        this.lines.forEach(x=>this.vectors = this.vectors.concat(Celtic.Vector.makeVectors(this, x)));

        this.vectors.forEach(x=>x.findNext());
        return this;
    }

    draw() {
        this.fillBg().drawPoints();
    }

    fillBg() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = this.style.fill;
        this.ctx.fillRect(0, 0, this.w, this.h);
        return this;
    }

    drawPoints() {
        this.points.forEach(x=>x.draw());
        this.vectors.forEach(x=>x.draw());
        return this;
    }
}


Celtic.Point = class Celtic_Point {
    get style() {
        return {
            fill: '#fff',
            r: 5,
            stroke: {
                w: 1,
                color: '#000'
            }
        }
    }

    constructor(celtic, coords) {
        this.celtic = celtic;
        this.coords = coords;
        this.vectors_out = [];
        this.vectors_in = [];
    }

    draw() {
        var ctx = this.celtic.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.style.fill;
        ctx.strokeStyle = this.style.stroke.color;
        ctx.lineWidth = this.style.stroke.w;
        ctx.arc(this.coords[0], this.coords[1], this.style.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    vector_in(vector) {
        this.vectors_in.push(vector);
    }

    vector_out(vector) {
        this.vectors_out.push(vector);
    }
};

Celtic.Vector = class Celtic_Vector {
    get style() {
        return {
            w: 1
        }
    }

    get config() {
        return {
            fill: {
                n: '0',
                z: '8',
                p: 'F'
            }
        }
    }

    static makeVectors(celtic, points) {
        return [
            new Celtic.Vector(celtic, points),
            new Celtic.Vector(celtic, [points[1], points[0]])]
    }

    constructor(celtic, points) {
        this.celtic = celtic;
        this.begin = celtic.points[points[0]];
        this.end = celtic.points[points[1]];
        this.vector = LA.pp2a(this.begin.coords, this.end.coords);
        this.begin.vector_out(this);
        this.end.vector_in(this);
        this.vector_prev = undefined;
        this.vector_next = undefined;
        this.support_prev = undefined;
        this.supoort_next = undefined;
    }

    findNext() {
        var found = null,
            deg = null;
        this.end.vectors_out.forEach(v=> {
            let _deg = LA.ab_rad(this.vector, v.vector);
            if (!found || _deg < deg) {
                found = v;
                deg = _deg;
            }
            //console.log('?', this.begin.coords, this.end.coords, this.vector, v.vector, LA.ab_rad(this.vector, v.vector));
        });
        this.vector_next = found;
        found.vector_prev = this;


        var supportPoint = LA.centerPoint(LA.centerPoint(this.begin.coords, this.end.coords), LA.centerPoint(found.begin.coords, found.end.coords)),
            c = LA.apb(supportPoint, LA.minus_a(this.end.coords)),
            c0 = c,
            c_radial = LA.xy2radial(c),
            cl = LA.a_length(c),
            ra_a = LA.xy2radial(LA.minus_a(this.vector)),
            ra_b = LA.xy2radial(found.vector),
            rad = (ra_a.a + ra_b.a + (ra_a.a <= ra_b.a ? 2 * Math.PI : 0)) / 2;
        //console.log(c, cl, LA.sin_ab(this.vector, c));
        if (!cl || !LA.sin_ab(this.vector, c)) {
            cl = (ra_a.r + ra_b.r) / 4 / Math.sqrt(2);
        } else {

        }
        c = LA.radial2xy({r: cl, a: rad}, true);
        if ((c0[0] && (c0[0] * c[0] < 0)) || (c0[1] && (c0[1] * c[1] < 0))) {
            c = [c[0] / Math.sqrt(2), c[1] / Math.sqrt(2)];
        }
        this.support_next = c;
        found.support_prev = c;

        console.log(this.begin.coords, this.end.coords, this.vector, found.vector, LA.ab_rad(this.vector, found.vector) / Math.PI);
    }

    direction2color(d) {
        return this.config.fill[d ? (d > 0 ? 'p' : 'n') : 'z'];
    }

    direction2shift(d) {
        return d ? (d > 0 ? 1 : -1) * this.style.w : 0;
    }

    get shift() {
        return [this.direction2shift(this.vector[1]), this.direction2shift(this.vector[0])]
    }

    draw() {
        this.drawVector().drawSupport().drawIn().drawOut();
    }

    drawVector() {
        var ctx = this.celtic.ctx,
            shift = this.shift;
        ctx.beginPath();
        ctx.strokeStyle = '#' + this.direction2color(this.vector[0]) + this.direction2color(this.vector[1]) + '0';
        ctx.lineWidth = this.style.w;
        ctx.moveTo(this.begin.coords[0] + shift[0], this.begin.coords[1] + shift[1]);
        ctx.lineTo(this.end.coords[0] + shift[0], this.end.coords[1] + shift[1]);
        ctx.stroke();
        return this;
    }

    drawSupport() {
        return this;
        var ctx = this.celtic.ctx,
            c_coords = LA.apb(this.end.coords, this.support_next);
        ctx.beginPath();
        ctx.strokeStyle = '#' + this.direction2color(this.support_next[0]) + this.direction2color(this.support_next[1]) + '0';

        ctx.lineWidth = 1;
        ctx.moveTo(this.end.coords[0], this.end.coords[1]);
        ctx.lineTo(c_coords[0], c_coords[1]);
        ctx.stroke();
        return this;
    }

    drawIn() {
        var ctx = this.celtic.ctx,
            c = LA.centerPoint(this.begin.coords, this.end.coords),
            s_coords = LA.apb(this.begin.coords, this.support_prev),
            dirIn = LA.rotate_a_deg(-45, this.vector),
            dirS = LA.rotate_a_deg(-90, this.support_prev),
            s0 = LA.pa2s(s_coords, dirS),
            s1 = LA.pa2s(c, dirIn),
            cross_coords = LA.straights_cross(s0, s1),
            sdc = LA.centerPoint(s_coords, cross_coords),
            dc = LA.centerPoint(c, cross_coords);

        //console.log(s0, s1, cross_coords);
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(c[0], c[1]);
        if (cross_coords[0] == Infinity || cross_coords[0] == -Infinity) {
            ctx.lineTo(s_coords[0], s_coords[1]);
        } else {
            ctx.bezierCurveTo(dc[0], dc[1], sdc[0], sdc[1], s_coords[0], s_coords[1]);
        }
        ctx.stroke();


        return this;
    }

    drawOut() {
        var ctx = this.celtic.ctx,
            c = LA.centerPoint(this.begin.coords, this.end.coords),
            s_coords = LA.apb(this.end.coords, this.support_next),
            dirOut = LA.rotate_a_deg(45, this.vector),
            dirS = LA.rotate_a_deg(90, this.support_next),
            s0 = LA.pa2s(s_coords, dirS),
            s1 = LA.pa2s(c, dirOut),
            cross_coords = LA.straights_cross(s0, s1),
            sdc = LA.centerPoint(s_coords, cross_coords),
            dc = LA.centerPoint(c, cross_coords);
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(c[0], c[1]);
        if (cross_coords[0] == Infinity || cross_coords[0] == -Infinity) {
            ctx.lineTo(s_coords[0], s_coords[1]);
        } else {
            ctx.bezierCurveTo(dc[0], dc[1], sdc[0], sdc[1], s_coords[0], s_coords[1]);
        }
        ctx.stroke();

        return this;
    }

};

//Celtic.Controls = class {
//    get config() {
//        return {
//            id: "controls"
//        }
//    }
//
//    constructor(celtic) {
//        this.celtic = celtic;
//    }
//};

var celtic = new Celtic();
celtic.draw();