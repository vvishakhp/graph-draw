import { Type } from "./TypeRegistry";
import ArrayList from "./util/ArrayList";
import { Figure } from "./Figure";

@Type('Selection')
export class Selection {
  private primary: Figure = null;
  private all = new ArrayList<Figure>();

  clear() {
    this.primary = null;
    this.all = new ArrayList();

    return this;
  }

  getPrimary() {
    return this.primary;
  }

  setPrimary(figure: Figure) {
    this.primary = figure;
    this.add(figure);

    return this;
  }

  remove(figure: Figure) {
    this.all.remove(figure);
    if (this.primary === figure) {
      this.primary = null;
    }
    return this;
  }

  add(figure: Figure) {
    if (figure !== null && !this.all.contains(figure)) {
      this.all.add(figure);
    }

    return this;
  }

  contains(figure, checkDescendant = false) {
    if (checkDescendant) {
      for (let i = 0; i < this.all.getSize(); i++) {
        let figureToCheck = this.all.get(i);
        if (figureToCheck === figure || figureToCheck.contains(figure)) {
          return true;
        }
      }
      return false;
    }
    return this.all.contains(figure);
  }

  getSize() {
    return this.all.getSize();
  }

  getAll(expand: boolean = false) {
    if (expand === true) {
      let result = new ArrayList<Figure>();
      let addRecursive = (figures) => {
        result.addAll(figures, true);
        figures.each((index, figure) => {
          if (figure instanceof StrongComposite) {
            addRecursive(figure.getAssignedFigures());
          }
        });
      };
      addRecursive(this.all);

      return result;
    }

    return this.all.clone();
  }

  each(func, reverse) {
    this.all.each(func, reverse);

    return this;
  }
}

