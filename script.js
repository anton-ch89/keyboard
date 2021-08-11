'use strict';


const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },

    properties: {
        value: "",
        capsLock: false,
    },

    init() {
        //Создаем главные элементы
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        //Устаавливаем классы и элементы
        this.elements.main.classList.add('keyboard', 'keyboard-hidden');
        this.elements.keysContainer.classList.add('keyboard-keys');
        this.elements.keysContainer.append(this.createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard-key');

        //Добавляем элементы в DOM
        this.elements.main.append(this.elements.keysContainer);
        document.body.append(this.elements.main);

        document.querySelectorAll('input').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
        document.querySelectorAll('textarea').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 
            'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
             'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.','?', 'done',
            'space'
        ];

        //Создаем иконки
        const createIconHTML = function (iconName)  {
            return `<i class="material-icons">${iconName}</i>`;
        };

        keyLayout.forEach(key=>{
            const keyElement = document.createElement('button');
            const insertBreak = ['backspace', 'p', 'enter','done'].indexOf(key) !== -1;

            //Добавляем атрибуты и классы
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard-key');

            //Добавляем специльные клавиши
            switch (key){
                case 'backspace':
                    keyElement.classList.add('keyboard-key-wide');
                    keyElement.innerHTML = createIconHTML('backspace');

                    keyElement.addEventListener('click', ()=>{
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this.triggerEvent('oninput');
                    });

                    break;
                
                case 'caps':
                    keyElement.classList.add('keyboard-key-wide', 'keyboard-activatable');
                    keyElement.innerHTML = createIconHTML('keyboard_capslock');

                    keyElement.addEventListener('click', ()=>{
                        this._toggleCapsLock();
                        keyElement.classList.toggle('keyboard-key-active', this.properties.capsLock);
                    });

                    break;

                case 'enter':
                    keyElement.classList.add('keyboard-key-wide');
                    keyElement.innerHTML = createIconHTML('keyboard_return');

                    keyElement.addEventListener('click', ()=>{
                        this.properties.value += '\n';
                        this.triggerEvent('oninput');
                    });

                    break;
                
                case 'space':
                    keyElement.classList.add('keyboard-key-extra-wide');
                    keyElement.innerHTML = createIconHTML('space_bar');

                    keyElement.addEventListener('click', ()=>{
                        this.properties.value += ' ';
                        this.triggerEvent('oninput');
                    });

                    break;
                
                case 'done':
                    keyElement.classList.add('keyboard-key-wide', 'keyboard-key-dark');
                    keyElement.innerHTML = createIconHTML('check_circle');

                    keyElement.addEventListener('click', ()=>{
                        this.close();
                        this.triggerEvent('onclose');
                    });

                    break;

            //Добавляем общие клавиши

            default: 
                    keyElement.textContent = key.toLocaleLowerCase();

                    keyElement.addEventListener('click', ()=>{
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this.triggerEvent('oninput');
                    });

                    break;
            }

            fragment.append(keyElement);
            if (insertBreak) {
                fragment.append(document.createElement('br'));
            }
        });
        return fragment;
    },

    triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        this.elements.keys.forEach((key) => {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        });
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard-hidden');
    },

    close(oninput, onclose) {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard-hidden');
    }
};

window.addEventListener('DOMContentLoaded', ()=>{
    Keyboard.init();
});