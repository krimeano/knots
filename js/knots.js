"use strict";

var LA = LinealAlgebra;

class Knots {
    get config() {
        return {
            id: "myCanvas",
            bg: "#888",
            grid: {
                color: "#666",
                size: 100,
                point: 2
            }
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
        this.zero = {
            x: Math.floor(this.w / this.config.grid.size),
            y: Math.floor(this.h / this.config.grid.size)
        };
        this.max = {
            x: Math.floor(this.w / 2 / this.config.grid.size),
            y: Math.floor(this.h / 2 / this.config.grid.size)
        };
        this.min = {
            x: -this.max.x,
            y: -this.max.x
        };
        this.walls = [];
        this.fillBg()
            .fillGrid()
            .addWalls().findNeighbourWalls().drawConnections();
    }

    fillBg() {
        this.ctx.fillStyle = this.config.bg;
        this.ctx.fillRect(0, 0, this.w, this.h);
        return this;
    }

    fillGrid() {
        var halfPoint = this.config.grid.point / 2,
            doublePoint = this.config.grid.point * 2,
            realX, realY, pointWR, pointHR, pointW, pointH;
        this.ctx.fillStyle = this.config.grid.color;

        for (let x = this.min.x; x <= this.max.x; x++) {
            realX = this.xToRealX(x);
            pointWR = x ? halfPoint : this.config.grid.point;
            pointW = x ? this.config.grid.point : doublePoint;
            for (let y = this.min.y; y <= this.max.y; y++) {
                pointHR = y ? halfPoint : this.config.grid.point;
                pointH = y ? this.config.grid.point : doublePoint;
                realY = this.yToRealY(y);
                this.ctx.fillRect(realX - pointWR, realY - pointHR, pointW, pointH);
            }
        }
        return this;
    }

    xToRealX(x) {
        return this.center.x + x * this.config.grid.size
    }

    yToRealY(y) {
        return this.center.y + y * this.config.grid.size
    }

    addWalls() {


        this.walls.push(new KnotsWall(this, 3, -3, 3, -2));
        this.walls.push(new KnotsWall(this, 3, -2, 3, -1));


        this.walls.push(new KnotsWall(this, 0, -3, 1, -3));
        this.walls.push(new KnotsWall(this, 1, -3, 1, -2));

        this.walls.push(new KnotsWall(this, -3, -3, -2, -3));

        this.walls.push(new KnotsWall(this, 1, 1, 2, 1));
        this.walls.push(new KnotsWall(this, 2, 1, 3, 1));
        this.walls.push(new KnotsWall(this, 1, 2, 2, 2));
        this.walls.push(new KnotsWall(this, 2, 2, 3, 2));
        this.walls.push(new KnotsWall(this, 1, 1, 1, 2));
        this.walls.push(new KnotsWall(this, 2, 1, 2, 2));
        this.walls.push(new KnotsWall(this, 3, 1, 3, 2));
        this.walls.push(new KnotsWall(this, 2, 0, 2, 1));
        this.walls.push(new KnotsWall(this, 2, 2, 2, 3));


        this.walls.push(new KnotsWall(this, -3, 3, -2, 3));
        this.walls.push(new KnotsWall(this, -2, 3, -1, 3));
        this.walls.push(new KnotsWall(this, -1, 3, 0, 3));

        this.walls.push(new KnotsWall(this, -3, 2, -2, 2));
        this.walls.push(new KnotsWall(this, -2, 2, -1, 2));

        this.walls.push(new KnotsWall(this, -3, 1, -2, 1));
        this.walls.push(new KnotsWall(this, -2, 1, -1, 1));

        this.walls.push(new KnotsWall(this, -3, 0, -2, 0));
        this.walls.push(new KnotsWall(this, -2, 0, -1, 0));
        //this.walls.push(new KnotsWall(this, -1, 0, 0, 0));

        this.walls.push(new KnotsWall(this, -3, -1, -2, -1));
        this.walls.push(new KnotsWall(this, -2, -1, -1, -1));
        this.walls.push(new KnotsWall(this, -1, -1, 0, -1));

        this.walls.push(new KnotsWall(this, -3, -1, -3, 0));
        this.walls.push(new KnotsWall(this, -3, 0, -3, 1));
        this.walls.push(new KnotsWall(this, -3, 1, -3, 2));
        this.walls.push(new KnotsWall(this, -3, 2, -3, 3));

        this.walls.push(new KnotsWall(this, -2, -1, -2, 0));
        //this.walls.push(new KnotsWall(this, -2, 0, -2, 1));
        this.walls.push(new KnotsWall(this, -2, 1, -2, 2));
        this.walls.push(new KnotsWall(this, -2, 2, -2, 3));

        this.walls.push(new KnotsWall(this, -1, -2, -1, -1));
        this.walls.push(new KnotsWall(this, -1, -1, -1, 0));
        this.walls.push(new KnotsWall(this, -1, 0, -1, 1));
        this.walls.push(new KnotsWall(this, -1, 1, -1, 2));
        this.walls.push(new KnotsWall(this, -1, 2, -1, 3));

        this.walls.push(new KnotsWall(this, 0, -1, 0, 0));

        return this;
    }

    findNeighbourWalls() {
        this.walls.forEach(w=> {
            w.findNeighbours()
        });
        return this;
    }

    drawConnections() {
        this.walls.forEach(w=>w.drawConnections());
        return this;
    }
}

class KnotsWall {
    get config() {
        return {
            w: 2,
            color: "#444",
            guide: {
                color: "#222",
                l: 10,
                w: 1
            }
        };
    }

    get ends() {
        return [[this.x0, this.y0], [this.x1, this.y1]];
    }

    constructor(knots, x0, y0, x1, y1) {
        this.knots = knots;
        if (Math.abs(x1 - x0) > 1 || Math.abs(y1 - y0) > 1) {
            throw "wall can be only 1 unit long";
        }
        if ((x1 - x0) && (y1 - y0)) {
            throw "Expected walls on grids";
        }

        this.x0 = x0;
        this.realX0 = this.knots.xToRealX(this.x0);
        this.y0 = y0;
        this.realY0 = this.knots.yToRealY(this.y0);
        this.x1 = x1;
        this.realX1 = this.knots.xToRealX(this.x1);
        this.y1 = y1;
        this.realY1 = this.knots.yToRealY(this.y1);

        this.center = {
            x: (this.realX0 + this.realX1) / 2,
            y: (this.realY0 + this.realY1) / 2
        };

        this.guides = [];
        this.neigbours = {};
        this.neigbours[this.ends[0]] = null;
        this.neigbours[this.ends[1]] = null;
        //console.log(this.neigbours);
        this
            .draw()
            .addGuides();
    }

    draw() {
        var ctx = this.knots.ctx;
        ctx.beginPath();
        ctx.strokeStyle = this.config.color;
        ctx.width = this.config.w;
        ctx.moveTo(this.realX0, this.realY0);
        ctx.lineTo(this.realX1, this.realY1);
        ctx.stroke();
        return this;
    }

    addGuides() {
        this.addGuide(-1, -1)
            .addGuide(-1, 1)
            .addGuide(1, 1)
            .addGuide(1, -1);
        return this;
    }

    addGuide(dirX, dirY) {
        this.guides.push(new KnotsWallGuide(this.knots, this, dirX, dirY));
        return this;
    }

    findNeighbours() {
        this.ends.forEach(this.findNeighbourByPoint.bind(this));
    }

    findNeighbourByPoint(point) {
        var end = this.ends.filter(e=> e.toString() != point.toString())[0],
            a = LA.pp2a(point, end), w, b_end, c, ww;
        var k = 0;
        c = a;
        while (!w && k < 10) {
            k++;
            c = LA.rotate_right_cw(c);
            b_end = LA.apb(point, c);
            //console.log('?', [point, b_end].toString());
            ww = this.knots.walls.filter(x=> {
                //console.log('?', x.ends.toString(), '=', [point, b_end].toString(), '||', [b_end, point].toString());
                return x.ends.toString() == [point, b_end].toString() || x.ends.toString() == [b_end, point].toString();
            });
            if (ww.length) {
                w = ww[0];
                //console.log(w);
            }
        }
        this.neigbours[point] = {
            size: k,
            wall: w
        };
        //console.log(point, end, v);
    }

    drawConnections() {
        this.ends.forEach(x=> {
            this.drawConnection(x, 0.6, 'black').drawConnection(x, 0.5, 'white');
        });
        return this;
    }

    drawConnection(point, w2L, color) {
        var gFrom = this.guides.filter(g=>g.point.toString() == point.toString() && g.direction < 0)[0],
            gTo = this.neigbours[point].wall.guides.filter(g=>g.point.toString() == point.toString() && g.direction > 0)[0],
            L = Math.floor((this.neigbours[point].size - 1) * Math.PI * this.knots.config.grid.size / 8),
            end = this.ends.filter(e=> e.toString() != point.toString())[0],
            end1 = this.neigbours[point].wall.ends.filter(e=> e.toString() != point.toString())[0],
            a = LA.pp2a(end, point), b = LA.pp2a(point, end1),
            hw = Math.round(this.knots.config.grid.size * w2L / 2),
            A0 = [this.center.x - hw * a[0], this.center.y - hw * a[1]],
            A1 = [this.center.x + hw * a[0], this.center.y + hw * a[1]],
            B0 = [gTo.wall.center.x + hw * b[0], gTo.wall.center.y + hw * b[1]],
            B1 = [gTo.wall.center.x - hw * b[0], gTo.wall.center.y - hw * b[1]];


        var ctx = this.knots.ctx;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.width = 1;
        ctx.moveTo(A0[0], A0[1]);

        if (!L) {
            ctx.lineTo(B0[0], B0[1]);
            ctx.lineTo(B1[0], B1[1]);
            ctx.lineTo(A1[0], A1[1]);
        } else {
            var L0 = Math.round(L * (1 + w2L));
            var L1 = Math.round(L * (1 - w2L));
            ctx.bezierCurveTo(
                A0[0] + gFrom.dir[0] * L0,
                A0[1] + gFrom.dir[1] * L0,
                B0[0] + gTo.dir[0] * L0,
                B0[1] + gTo.dir[1] * L0,
                B0[0],
                B0[1]
            );
            ctx.lineTo(B1[0], B1[1]);
            ctx.bezierCurveTo(
                B1[0] + gTo.dir[0] * L1,
                B1[1] + gTo.dir[1] * L1,
                A1[0] + gFrom.dir[0] * L1,
                A1[1] + gFrom.dir[1] * L1,
                A1[0],
                A1[1]
            );
        }
        ctx.closePath();
        //
        ctx.fill();
        return this;
    }
}

class KnotsWallGuide {
    get config() {
        return {
            w: 1,
            color: 'black',
            colorIn: 'orange',
            colorOut: 'lime',
            l: 10
        }
    }

    constructor(knots, wall, dirX, dirY) {
        this.knots = knots;
        this.wall = wall;
        this.dir = [dirX, dirY];
        this.point = null;
        this.direction = 0;
        this.defineRelatedPoint().draw();
    }

    defineRelatedPoint() {
        var w = LA.pp2a(this.wall.ends[0], this.wall.ends[1]),
            xProjection = w[0] * this.dir[0],
            yProjection = w[1] * this.dir[1],
            WxG = LA.det([w, this.dir]),
            p;

        if (!yProjection) {
            p = xProjection > 0 ? 1 : -1;
        } else {
            p = yProjection > 0 ? 1 : -1;
        }
        this.direction = p * WxG;
        this.point = this.wall.ends[p > 0 ? 1 : 0];
        return this;
    }

    draw() {
        var ctx = this.knots.ctx;
        ctx.beginPath();
        ctx.strokeStyle = this.direction ?
            (this.direction > 0 ? this.config.colorIn : this.config.colorOut) :
            this.config.color;
        ctx.width = this.config.w;
        ctx.moveTo(this.wall.center.x, this.wall.center.y);
        ctx.lineTo(this.wall.center.x + this.dir[0] * this.config.l, this.wall.center.y + this.dir[1] * this.config.l);
        ctx.stroke();
        return this;
    }

}
var knots = new Knots();
