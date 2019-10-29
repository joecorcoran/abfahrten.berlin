import * as Im from 'immutable';

class Line {
  static order(set) {
    const productOrder = function(line) {
      switch(line.product) {
        case 'subway': return 1;
        case 'suburban': return 2;
        case 'tram': return 3;
        case 'bus': return 4;
        case 'train': return 5;
        default: return 6;
      }
    };

    return Im.Set(set).sortBy(l => l.num).sortBy(productOrder);
  }

  constructor(data) {
    this.data = data;
  }

  get key() {
    return this.data.name;
  }

  equals(other) {
    return this.key === other.key;
  }

  hashCode() {
    return parseInt(this.key, 10) | 0;
  }

  get num() {
    return this.data.name.replace(/Tram |Bus /, '');
  }

  get product() {
    return this.data.product;
  }
}

export default Line;
