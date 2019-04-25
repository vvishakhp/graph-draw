import { Spline, ArrayList } from '../../imports';
export class CubicSpline extends Spline {
    generate(controlPoints: ArrayList<any>, parts: number) {
        return null;
    }


    blend(i, t) {
        if (i == -2)
            return ((-t + 2) * t - 1) * t / 2;
        else if (i == -1)
            return (((3 * t - 5) * t) * t + 2) / 2;
        else if (i == 0)
            return ((-3 * t + 4) * t + 1) * t / 2;
        else
            return ((t - 1) * t * t) / 2;
    }
    
}
