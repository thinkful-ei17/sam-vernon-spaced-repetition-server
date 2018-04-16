'use strict';

class LinkedList {
    constructor() {
        this.head = null;
    }

    insertFirst(item) {
        this.head = new _Node(item, this.head);
    }

    insertLast(item) {
        if(this.head === null) {
            this.insertFirst(item);
        } else{
            let current = this.head;

            while(current.next !== null) {
                current = current.next;
            }
            current.next = new _Node(item, null);
        }
    }

    insertBefore(match, newValue) {
        if (!this.head) {
            return null;
        }

        if(this.head.value === match) {
            this.insertFirst(newValue);
            return;
        }

        let current = this.head;
        let previous = this.head;


        while(current !== null) {

            if(current.value === match) {
                previous.next = new _Node(newValue, current);
                return;
            }
            previous = current;
            current = current.next;
        }

        console.log('Item to insert before was not found');
        return;
    }

    insertAfter(match, newValue) {
        if (!this.head) {
            return null;
        }

        let current = this.head;

        while (current !== null) {
            if (current.value === match) {
                const tempNext = current.next;

                current.next = new _Node(newValue, tempNext);
                return;
            }
            current = current.next;
        }

        console.log('Item to insert after was not found');
        return;
    }

    insertAt(position, newValue) {
        if(!this.head) {
            return null;
        }

        if (position === 0) {
            this.insertFirst(newValue);
            return;
        }

        let counter = 0;
        let current = this.head;
        let previous = this.head;

        while(current !== null) {
            if(counter === position) {
                previous.next = new _Node(newValue, current);
                return;
            }
            previous = current;
            current = current.next;
            counter++;
        }
        console.log('Position was invalid');
        return;
    }

    find(item) {
        let current = this.head;

        if(!this.head) {
            return null;
        }

        while (current.next !== null) {

            if (current.value === item) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    remove(item) {
        if(!this.head) {
            return null;
        }

        if(this.head.value === item) {
            this.head = this.head.next;
            return;
        }

        let current = this.head;
        let previous = this.head;

        while(current !== null) {

            if (current.value === item) {
                previous.next = current.next;
                return;
            }

            previous = current;
            current = current.next;
        }

        console.log('Item not found');
        return;
    }

    printList() {
        if(!this.head) {
            return null;
        }
        let current = this.head;

        while (current !== null) {
            console.log(current.value);
            current = current.next;
        }
        return;
    }

    display() {
        if (!this.head) {
            return null;
        }

        const list = [];
        let current = this.head;

        while (current !== null) {
            list.push(current.value);
            current = current.next;
        }
        console.log(list);
        return;
    }

    removeHead() {
        if (this.head === null) {
            return null;
        } else if (this.head.next === null) {
            let oldHead = this.head;

            this.head = null;
            return oldHead.value;
        }

        let oldHead = this.head;

        this.head = this.head.next;
        return oldHead.value;

    }
}

class _Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

const _findNthElement = function(position, head) {
    let thisHead = head;

    for (let i = 0; i < position; i++) {
        if (thisHead.next) {
            thisHead = thisHead.next;
        }
    }

    return thisHead;
};

const insertAt = function(newValue, head) {

    let tempHead = head;

    if (!tempHead) {
        return null;
    }

    if (newValue.nValue < 0) {
        throw new Error('Position error');
    }

    if (newValue.nValue === 0) {
        let oldHead = tempHead;

        tempHead = new _Node(newValue, oldHead);

        return tempHead;
    }

    // Find the node which we want to insert after
    const node = _findNthElement(newValue.nValue - 1, tempHead);
    const newNode = new _Node(newValue, null);

    // oldNode -> new -> oldNodeNEXT
    newNode.next = node.next;
    node.next = newNode;

    return tempHead;

};

const insertLast = function(item, head) {
    let tempHead = head;

    if(tempHead === null) {
        tempHead = new Node(item, null);
    } else {
        let current = tempHead;

        while (current.next !== null) {
            console.log('traversing...');
            console.log('next', current.value);
            current = current.next;
        }

        current.next = new _Node(item, null);
    }

    return tempHead;
};

const removeHead = function(head) {

    if (head === null) {
        return head;
    } else if (head.next === null) {
        return null;
    }

    let thisHead = head;

    thisHead = head.next;
    return thisHead;

};

const display = function(head) {
    let tempHead = head;

    if (!tempHead) {
        return null;
    }

    const list = [];
    let current = tempHead;

    while (current !== null) {
        list.push(current.value);
        current = current.next;
    }
    console.log(list);
};

const giveLength = function(head) {
    let tempHead = head;

    if (!tempHead) {
        return null;
    }

    let counter = 0;
    let current = tempHead;

    while (current !== null) {
        counter += 1;
        current = current.next;
    }

    return counter;
};

module.exports = {
    LinkedList,
    removeHead,
    insertAt,
    insertLast,
    display,
    giveLength
};
