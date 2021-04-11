if (window.system == undefined) window.system = {}
system.uploadedfile = (function() {
    const that = this;
    /*
     */
    // variabili this.nome variabile.
    this.datauploaded = {}

    this.insertDataUploaded = (name, content) => {

        if (!Object.keys(this.datauploaded).includes(name)) {
            this.datauploaded[name] = (content)
        }
    }

    this.readDataUploaded = (name) => {
            if (!Object.keys(this.datauploaded).includes(name)) {
                alert("The dataset does not exist!")
                return
            } else
                return this.datauploaded[name];
        }
        /*
         */
    return this;
}).call({})