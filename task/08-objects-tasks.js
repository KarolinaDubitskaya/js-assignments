'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Перед началом работы с заданием, пожалуйста ознакомьтесь с туториалом:                         *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Возвращает объект Прямоугольник (rectangle) с параметрами высота (height) и ширина (width)
 * и методом getArea(), который возвращает площадь
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    let r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

Rectangle.prototype.getArea = function() {
    return this.height * this.width;
}


/**
 * Возвращает JSON представление объекта
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Возвращает объект указанного типа из представления JSON
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    let r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    return Object.assign(new proto.constructor(), JSON.parse(json));
}


/**
 * Создатель css селекторов
 *
 * Каждый комплексый селектор может состоять из эелемента, id, класса, атрибута, псевдо-класса и
 * псевдо-элемента
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Может быть несколько вхождений
 *
 * Любые варианты селекторов могут быть скомбинированы с помощью ' ','+','~','>' .
 *
 * Задача состоит в том, чтобы создать отдельный класс, независимые классы или
 * иерархию классов и реализовать функциональность
 * для создания селекторов css с использованием предоставленного cssSelectorBuilder.
 * Каждый селектор должен иметь метод stringify ()
 * для вывода строкового представления в соответствии с спецификацией css.
 *
 * Созданный cssSelectorBuilder должен использоваться как фасад
 * только для создания ваших собственных классов,
 * например, первый метод cssSelectorBuilder может быть таким:
 *
 * Дизайн класса(ов) полностью зависит от вас,
 * но постарайтесь сделать его максимально простым, понятным и читаемым насколько это возможно.
 *
 * @example
 *
 *  let builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  Если нужно больше примеров - можете посмотреть юнит тесты.
 */

const cssSelectorBuilder = {
    element: function(value) {
        return new Selector().element(value);
    },

    id: function(value) {
        return new Selector().id(value);
    },

    class: function(value) {
        return new Selector().class(value);
    },

    attr: function(value) {
        return new Selector().attr(value);
    },

    pseudoClass: function(value) {
        return new Selector().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new Selector().pseudoElement(value);
    },

    combine: function(selector1, combinator, selector2) {
        return new Selector().combine(selector1, combinator, selector2);
    }
};

class Selector {
    constructor() {
        this.index_of_selector = 0;
        this.element_val = null;
        this.id_val = null;
        this.classes = [];
        this.attributes = [];
        this.pseudoClasses = [];
        this.pseudoElement_val = null;
        this.selectors = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement', 'combine'];
        this.combinator = null;
        this.selector2 = null;
    }

    check_order(curr_elem) {
        if (this.index_of_selector > this.selectors.indexOf(curr_elem)) {
            throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
        }
        this.index_of_selector = this.selectors.indexOf(curr_elem);
    }

    element(value) {
        this.check_order('element');
        if (!this.element_val) {
            this.element_val = value;
        } else {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
        return this;
    }

    id(value) {
        this.check_order('id');
        if (!this.id_val) {
            this.id_val = value;
        } else {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
        return this;
    }

    class(value) {
        this.check_order('class');
        this.classes.push(value);
        return this;
    }

    attr(value) {
        this.check_order('attr');
        this.attributes.push(value);
        return this;
    }

    pseudoClass(value) {
        this.check_order('pseudoClass');
        this.pseudoClasses.push(value);
        return this;
    }

    pseudoElement(value) {
        this.check_order('pseudoElement');
        if (!this.pseudoElement_val) {
            this.pseudoElement_val = value;
        } else {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
        return this;
    }

    combine(selector1, combinator, selector2) {
        this.check_order('combine');
        Object.assign(this, selector1);
        this.combinator = combinator;
        this.selector2 = selector2;
        return this;
    }

    stringify() {
        let result  = '';
        if (this.element_val) { 
            result += this.element_val;
        }
        if (this.id_val) {
            result += '#' + this.id_val;
        }

        this.classes.forEach (v => result += '.' + v);
        this.attributes.forEach (v => result += '[' + v + ']');
        this.pseudoClasses.forEach (v => result += ':' + v); 

        if (this.pseudoElement_val) { 
            result += '::' + this.pseudoElement_val;
        }
        if (this.combinator && this.selector2) {
            result += ' ' + this.combinator + ' ' + this.selector2.stringify();
        }
        return result; 
    }
}


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
