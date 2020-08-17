
class Select {
    constructor(el, data) {
        this.$data = data;
        this.$element = el;
    }
    FillingFile(){
        this.$element.change((event)=> {
            let file = event.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                let json = JSON.parse(reader.result);
                this.$data.empty();
                let data = new DataInfo(json, $("#data-info"));
                data.check();
                data.reference();
                data.button();
            };
        });
    }
}
class DataInfo {
    constructor(options, el) {
        this.$el = el;
        this.option = options;
        this.name = options.name;
        this.fields = options.fields;
        this.references = options.references;
        this.buttons = options.buttons;
        this.name = options.name;

        this.required = false;
        this.multiple = false;
        this.placeholder = '';
        this.mask = '';
        this.checked = false;
        this.ref = '';
        this.text = '';
        this.textWR = '';

        this.maskId = 0;
    }
    check() {
        this.$el.append(`<h1 class="mb-3">${this.name}</h1>`)
        this.fields.map((name)=>{
            this.required = name.input.required || false;
            this.multiple = name.input.multiple || false;
            this.placeholder = name.input.placeholder || '';
            this.mask = name.input.mask || '';
            if(name.input.type === 'textarea'){
                this.$el.append(`<div class="form-group">
                                    <label for="inp-control">${name.label}</label>
                                    <textarea required="${this.required}" id="inp-control" class="form-control" rows="5"></textarea>
                                </div>`)
            }else if(!name.label){
                this.$el.append(`<div class="form-group">
                                    <input type="${name.input.type}" required="${this.required}" multiple="${this.multiple}" placeholder="${this.placeholder}" id="inp-control" class="form-control">
                                </div>`)
            }else if(name.input.type === 'color'){
                this.$el.append(`<div class="form-group" id="colors">
                                    <input value="#3366ff" type="${name.input.type}" required="${this.required}" multiple="${this.multiple}" placeholder="${this.placeholder}" id="inp-control" class="form-control" list="colorList">
                                </div>`)
                $('#colors').append('<datalist id="colorList"></datalist>')
                name.input.colors.forEach((item)=>{
                    $('#colorList').append(`<option value="${item}" label="${item}">`)
                });
            }else if(name.input.type === 'technology'){
                this.$el.append(`<div class="form-group">
                                   <select id="${name.input.type}" class="form-control" type="${name.input.type}" required="${this.required}" multiple="${this.multiple}"></select>
                                </div>`)
                name.input.technologies.forEach((item)=>{
                    $(`#${name.input.type}`).append(`<option value="${item}" label="${item}">`)
                });
            }else if(name.input.mask){
                this.$el.append(`<div class="form-group">
                                   <label class="w-100">${name.label}
                                       <input type="text" required="${this.required}" multiple="${this.multiple}"  placeholder="${this.placeholder}" class="form-control mask mt-2" id="mask_${this.maskId}">
                                   </label>
                                </div>`);
                $(`#mask_${this.maskId}`).mask(name.input.mask);

                this.maskId++;
            }else {
                this.$el.append(`<div class="form-group">
                                    <label for="inp-control">${name.label}</label>
                                    <input type="${name.input.type}" required="${this.required}" multiple="${this.multiple}"  placeholder="${this.placeholder}" id="inp-control" class="form-control">
                                </div>`)
            }
        })
    }
    reference(){
        this.references.forEach((item)=>{
            let log = Object.keys(item);
            if(log[0] === 'input'){
                for(let i in item){
                    this.required = item[i].required;
                    this.checked = item[i].checked;
                    this.$el.append(`<div class="form-group" style="display:inline">
                                        <${i} type="${item[i].type}" required="${this.required}" checked="${this.checked}" id="checked">
                                    </div>`)
                    if(this.checked != 'true') {
                        $('#checked').attr('checked', false)
                    }
                }
            }else {
                this.ref = item.ref || '';
                this.text = item.text || '';
                this.textWR = item['text without ref'] || '';
                this.$el.append(`<p style="display:inline;">
                                    ${this.textWR}
                                    <a href="${this.ref}">${this.text}</a>
                                </p>`)
            }
        });
    }
    button(){
        this.$el.append(`<div class="form-group buttons"></div>`);
        this.buttons.forEach((item)=>{
            $(`.buttons`).append(`<button class="btn btn-primary mt-3 mr-3">${item.text}</button>`)
        });
    }
}
let output = new Select($("#cont"), $("#data-info"));
output.FillingFile();



