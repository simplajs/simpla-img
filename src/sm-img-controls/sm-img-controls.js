class SmImgControls {
  beforeRegister() {
    this.is = 'sm-img-controls';

    this.properties = {
      title: String,
      file: String,
      zoom: Number
    }
  }

  _fileChosen(event) {
    let filePicker = event.target,
        files = filePicker.files;

    if (files) {
      this._loadFile(files[0]);
    } else {
      throw new Error('Could not load file');
    }
  }

  _loadFile(file) {
    let reader = new FileReader();

    reader.onloadend = () => this.src = reader.result;

    reader.readAsDataURL(file);
  }
}

Polymer(SmImgControls);
