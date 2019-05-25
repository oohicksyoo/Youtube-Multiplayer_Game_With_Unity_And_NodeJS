module.exports = class Vector2 {
    constructor(X = 0, Y = 0) {
        this.x = X;
        this.y = Y;
    }

    Magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y)); 
    }

    Normalized() {
        var mag = this.Magnitude();
        return new Vector2(this.x / mag, this.y / mag);
    }

    Distance(OtherVect = Vector2) {
        var direction = new Vector2();
        direction.x = OtherVect.x - this.x;
        direction.y = OtherVect.y - this.y;
        return direction.Magnitude();
    }

    ConsoleOutput() {
        return '(' + this.x + ',' + this.y + ')';
    }
}