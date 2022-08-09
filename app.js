class App {
  constructor(){
    this.notes = JSON.parse(localStorage.getItem('notes')) || []
    this.id = ''

    this.$placeholder = document.querySelector('#placeholder')
    this.$form = document.querySelector('#form')
    this.$notes = document.querySelector('#notes')
    this.$noteTitle = document.querySelector('#note-title')
    this.$noteText = document.querySelector('#note-text')
    this.$formButtons = document.querySelector('#form-buttons')
    this.$formCloseButton = document.querySelector('#form-close-button')
    this.$colorTooltip = document.querySelector('#color-tooltip')

    this.$modal = document.querySelector('.modal')
    this.$modalTitle = document.querySelector('.modal-title')
    this.$modalText = document.querySelector('.modal-text')
    this.$modalCloseButton = document.querySelector('.modal-close-button')

    this.addEventListeners()
    this.render()
  }
  addEventListeners(){
    document.body.addEventListener('click', event => {
      this.handleFormClick(event)
      this.openModal(event)
      this.deleteNote(event)
    })

    document.body.addEventListener('mouseover', event => {
      this.openTooltip(event)
    })

    document.body.addEventListener('mouseout', event => {
      this.closeTooltip(event)
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

    this.$modalCloseButton.addEventListener('click', () => {
      this.editNote(this.id)
      this.closeModal()
    })

    this.$colorTooltip.addEventListener('mouseover', function(){
      this.style.display = "block"
    })

    this.$colorTooltip.addEventListener('mouseout', function(){
      this.style.display = "none"
    })

    this.$colorTooltip.addEventListener('click', event => {
      this.editNoteColor(event)
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

  openModal(event){
    if (event.target.matches('.toolbar-delete')) return
    const $selectedNote = event.target.closest('.note')
    if(!$selectedNote) return
    this.$modal.classList.toggle('open-modal')
    const [noteTitle, noteText] = $selectedNote.children
    this.$modalTitle.value = noteTitle.textContent
    this.$modalText.value = noteText.textContent
    this.id = Number($selectedNote.dataset.id)
  }

  closeModal(){
    this.$modal.classList.toggle('open-modal')
    this.$modalTitle.value = ""
    this.$modalText.value = ""
  }

  openTooltip(event){
    if(!event.target.matches('.toolbar-color')) return
    this.$colorTooltip.style.display = "block"
    const {x, y} = event.target.getBoundingClientRect()
    this.$colorTooltip.style.left = `${x-10}px`
    this.$colorTooltip.style.top = `${y+20}px`
    this.id = Number(event.target.dataset.id)
  }

  closeTooltip(event){
    if(!event.target.matches('.toolbar-color')) return
    this.$colorTooltip.style.display = "none"
  }

  addNote(){
    const title = this.$noteTitle.value
    const text = this.$noteText.value
    if (!title && !text) return
    const newNote = {
      title,
      text,
      color: "#fff",
      id: this.notes.length > 0 ? this.notes[this.notes.length-1].id + 1 : 1
    }
    this.notes = [...this.notes, newNote]
    this.render()
  }

  editNote(id){
    const title = this.$modalTitle.value
    const text = this.$modalText.value
    this.notes = this.notes.map(note => 
      note.id === id ? {...note, title, text} : note)
    this.render()
  }

  editNoteColor(event){
    if (!event.target.matches('.color-option')) return
    const color = event.target.dataset.color
    if (!color) return
    this.notes = this.notes.map(note => 
      note.id === this.id ? {...note, color} : note)
    this.render()
  }

  deleteNote(event){
    event.stopPropagation()
    if (!event.target.matches('.toolbar-delete')) return
    const id = Number(event.target.dataset.id)
    this.notes = this.notes.filter(note => note.id !== id)
    this.render()
  }

  render(){
    this.displayNotes()
    this.saveNotes()
  }

  saveNotes(){
    localStorage.setItem('notes', JSON.stringify(this.notes))
  }

  displayNotes(){
    this.$placeholder.style.display = this.notes.length > 0 ? "none" : "flex"

    this.$notes.innerHTML = this.notes.map(note => `
      <div style="background: ${note.color}" class='note' data-id=${note.id}>
        <div class="note-title">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
          <div class="toolbar">
            <img class="toolbar-color" data-id=${note.id} src="./icons/palette-line.svg">
            <img class="toolbar-delete" data-id=${note.id} src="./icons/delete-bin-7-line.svg">
          </div>
        </div>
      </div>
    `).join('')
  }
}

new App()