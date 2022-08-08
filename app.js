class App {
  constructor(){
    this.notes = []

    this.$placeholder = document.querySelector('#placeholder')
    this.$form = document.querySelector('#form')
    this.$notes = document.querySelector('#notes')
    this.$noteTitle = document.querySelector('#note-title')
    this.$noteText = document.querySelector('#note-text')
    this.$formButtons = document.querySelector('#form-buttons')
    this.$formCloseButton = document.querySelector('#form-close-button')

    this.addEventListeners()
  }
  addEventListeners(){
    document.body.addEventListener('click', event => {
      this.handleFormClick(event)
      
    })

    this.$form.addEventListener('submit', event => {
      event.preventDefault()
      this.addNote()
      this.closeForm()
    })

    this.$formCloseButton.addEventListener('click', event => {
      event.stopPropagation()
      this.addNote()
      this.closeForm()
    })
  }
  handleFormClick(event){
    const isFormClicked = this.$form.contains(event.target)

    if (isFormClicked){
      this.openForm()
    } else {
      this.addNote()
      this.closeForm()
    }
  }

  openForm(){
    this.$form.classList.add('form-open')
    this.$noteTitle.style.display = "block"
    this.$formButtons.style.display = "block"
  }

  closeForm(){
    this.$form.classList.remove('form-open')
    this.$noteTitle.style.display = "none"
    this.$formButtons.style.display = "none"
    this.$noteTitle.value = ""
    this.$noteText.value = ""
  }

  addNote(){
    const title = this.$noteTitle.value
    const text = this.$noteText.value
    if (!title || !text) return
    const newNote = {
      title,
      text,
      color: "#fff",
      id: this.notes.length > 0 ? this.notes[this.notes.length-1].id + 1 : 1
    }
    this.notes = [...this.notes, newNote]
    this.displayNotes()
  }

  displayNotes(){
    this.$placeholder.style.display = this.notes>0 ? "none" : "flex"

    this.$notes.innerHTML = this.notes.map(note => `
      <div style="background: ${note.color}" class='note' data-id=${note.id}>
        <div class="note-title">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
          <div class="toolbar">
            <img class="toolbar-color" src="./icons/palette-line.svg">
            <img class="toolbar-delete" src="./icons/delete-bin-7-line.svg">
          </div>
        </div>
      </div>
    `).join('')
  }
}

new App()