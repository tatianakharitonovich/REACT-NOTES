import React, { Component } from 'react';
import './App.scss';
import Note from './note/note';

export const ClickedContext = React.createContext();

function createJson (notes) {
  const arr = notes.map((note) => {
    return ({заметка: `${note.text}`, теги: `${note.noteTags.join(', ')}`})
  });
  const file = JSON.stringify(arr);
  return file;
}

class App extends Component {

  state = {
    tags: [],
    notes: [],
    addNoteState: false,
    addFieldValue: {text: '', noteTags: [], readonly: true, active: true},
    listTags: '',
    addTagState: false,
    tagValue: '',
    file: '',
    isChangeNote: false,
  }

  onChangeNote (index) {
    const note = this.state.notes[index];
    note.readonly = false;
    const notes=this.state.notes;
    notes[index]=note;
    this.setState({
      notes: notes,
      isChangeNote: !this.state.isChangeNote,
    });
  }

  onChangeText(index, value) {
    const note = this.state.notes[index];
    note.text = value;
    const notes=this.state.notes;
    notes[index]=note;
    this.setState({
      notes: notes
    });
  }

  onFocusText(index, value) {
    const note = this.state.notes[index];
    const tags = this.state.tags;
    const arrTags = tags.map(str => {return str.slice(1)});
    arrTags.forEach(str=>{
      if (value.toUpperCase().includes(str.toUpperCase())) {
        value= value.replaceAll(str,`<u>${str}</u>&nbsp;`);
      }
    });
    note.text = value;
    const notes=this.state.notes;
    notes[index]=note;
    this.setState({
      notes: notes
    });
  }

  onChangeTags(index, value) {
    const note = this.state.notes[index];
    if (value) {    
      note.noteTags = value.split(', ');
      const notes=this.state.notes;
      notes[index]=note;
      this.setState({
        notes: notes
      });
    } else {
      note.noteTags =[];
      const notes=this.state.notes;
      notes[index]=note;
      this.setState({
        notes: notes
      });
    }
  }

  saveChangeNote(index) {
    const note = this.state.notes[index];
    if (note.text) {
      note.readonly = true;
      note.text = note.text.replaceAll('<u>','');
      note.text = note.text.replaceAll('</u>','');
      const notes=this.state.notes;
      notes[index]=note;
     
      const noteJson = {...notes[index]};
      noteJson.text = noteJson.text.replaceAll('<div>',' ');
      noteJson.text = noteJson.text.replaceAll('</div>',' ');
      noteJson.text = noteJson.text.replaceAll('&nbsp;',' ');
      noteJson.text = noteJson.text.replaceAll('<br>',' ');
      const notesJson=[...notes];
      notesJson[index] = noteJson;

      const tags = this.state.tags;
      let str = noteJson.text;
      
      if (str.includes('#')) {
        for (let i = 0; i < str.length; i++) {
          if (str[i] === '#') {
            for (let j=1; j < (str.length - i); j++) {
              if (j === (str.length -1 - i)) {
                if (note.noteTags.indexOf(str.substr(i,j+1)) === -1) {
                  note.noteTags.push(str.substr(i,j+1));
                }                
                i=i+j;
                break;
              }
              if (str[i+j] ===  ',' || str[i+j] === ' ') {
                if (note.noteTags.indexOf(str.substr(i,j)) === -1) {
                  note.noteTags.push(str.substr(i,j));
                }                
                i=i+j;
                break;
              }
              if (str[j] !== ',' || str[j] !== ' ') {
                continue;
              }
            }
          }
        }
      }
      const arr = note.noteTags;
      arr.forEach (tag => {
        if (tags.indexOf(tag) === -1) {
        tags.push(tag)
        }
      });
      if (tags.length > 1 && tags.indexOf('#все теги') === -1) {
        tags.unshift('#все теги');
      }

      this.setState({
        notes: notes,
        tags: tags,
        file: createJson (notesJson),
        isChangeNote: !this.state.isChangeNote,
      });
    }
  }

  onDelete (index) {
    const notes=this.state.notes;
   
    notes.splice(index,1);
    this.setState({
      notes: notes,
      file: createJson (notes),
      isChangeNote: false,      
    });
  }

  deleteTag(index) {
    const tags=this.state.tags;
   
    tags.splice(index,1);
    const tagsShot =[];
    if (tags.length < 3) {
      tagsShot.push(...tags.filter(str => str !== '#все теги'));
      this.setState({
        tags: tagsShot
      });
    } else {
      this.setState({
        tags: tags
      });
    }
  }

  showFieldNote () { 
    this.setState({
      addNoteState: !this.state.addNoteState,
      isChangeNote: !this.state.isChangeNote,

    });
  }

  addTextNote (value) {
    const addFieldValue = {...this.state.addFieldValue};
    addFieldValue.text = value;

    this.setState({
      addFieldValue: addFieldValue
    })
  }

  addTagsNote (value) {
    const listTags = value;
    
    this.setState({
      listTags: listTags
    })
  }

  cancelAddNote() {
    const addFieldValueNew = {text: '', noteTags: [], readonly: true, active: true};
    this.setState({
      addFieldValue: addFieldValueNew,
      addNoteState: false,
      listTags: '',
      isChangeNote: !this.state.isChangeNote,
    })
  }

  addNote() {
    if (this.state.addFieldValue.text) {
      const notes = this.state.notes;
      const addFieldValue = this.state.addFieldValue;
      const tags = this.state.tags;

      if (this.state.listTags) {
        const arr = this.state.listTags.split(',').map(str => {return `#${str}`});
        addFieldValue.noteTags = arr;
        
        arr.forEach (tag=> {
         if (tags.indexOf(tag) === -1) {
          tags.push(tag)
         }
        });
        if (tags.length > 1 && tags.indexOf('#все теги') === -1) {
          tags.unshift('#все теги');
        }
      }
      notes.unshift(addFieldValue);
      const addFieldValueNew = {text: '', noteTags: [], readonly: true, active: true};
      this.setState({
        notes: notes,
        tags: tags,
        addFieldValue: addFieldValueNew,
        addNoteState: false,
        listTags: '',
        file: createJson(notes),
        isChangeNote: !this.state.isChangeNote,
      })
    }
  }

  showFieldTag() {
    this.setState({
      addTagState: !this.state.addTagState,
      isChangeNote: !this.state.isChangeNote,
    });
  }

  addTagValue (value) {
    this.setState({
      tagValue: value, 
      checkTag: false,
    });    
  }

  cancelAddTag() {
    this.setState({
      addTagState: false,
      tagValue: '',
      checkTag: false,
      isChangeNote: !this.state.isChangeNote,    
    })
  }

  addTag() {
    if (this.state.tagValue) {
      const value = '#'+this.state.tagValue;
      const tags = this.state.tags;
      const isTag = tags.indexOf(value);
      if (isTag === -1) {
        tags.push(value);
        if (tags.length > 1 && tags.indexOf('#все теги') === -1) {
          tags.unshift('#все теги');
        }
        this.setState({
          tags: tags,
          addTagState: false,
          tagValue: '',
          checkTag: false,
          isChangeNote: !this.state.isChangeNote,    
        })
      } else {
        this.setState({
          checkTag: !this.state.checkTag
        });
      }
    }
    if (this.state.checkTag) {
      this.setState({
        tagValue: '',  
      })
    }
  }

  filterNotes(tag) {
    if (tag==='#все теги') {
      const notes=this.state.notes;
      notes.forEach((note)=> note.active=true);
      this.setState({
        notes: notes,  
      });
    } else {
      const notes=this.state.notes;
      notes.forEach((note)=> note.active=true);
      notes.forEach((note)=>{
        if (note.noteTags.indexOf(tag) === -1) {
          note.active=false
        }
      });
      this.setState({
        notes: notes,  
      });
    }
  }

  render () {
    const divStyle = {
      textAlign: 'center',
    }

    let tags = null;
    let notes = null;
    let addField = <div className = 'add-note-card'>
                    <h3>Добавить заметку</h3> 
                      <label> Введите текст заметки
                        <br/>
                        <input
                          className = 'add-note-card__input' 
                          value={this.state.addFieldValue.text}
                          onChange = {event => this.addTextNote(event.target.value)}
                        />
                      </label>
                      <label>Введите теги (через запятую, без пробелов и решеток)
                        <br/>
                        <input
                          className = 'add-note-card__input'  
                          value={this.state.listTags}
                          onChange = {event => this.addTagsNote(event.target.value)}
                        />
                      </label>				
                      <button 
                        className = 'add-note-card__button button button--save'
                        onClick={()=> this.addNote()}
                      >Сохранить
                      </button>
                      <button 
                        className = 'add-note-card__button button button--delete'
                        onClick={()=> this.cancelAddNote()}
                      >Отмена
                      </button>
                    </div>
    let addFieldTag = <div className = 'add-note-card'>
                        <h3>Добавить тег</h3>
                        <label> Введите тег
                          <br/>
                          <input
                            className = 'add-note-card__input' 
                            value={this.state.tagValue}
                            onChange = {event => this.addTagValue(event.target.value)}
                          />
                        </label>
                        {this.state.checkTag && <p>Такой тег уже существует</p>}                        				
                        <button
                          className='add-note-card__button button button--save'
                          onClick={()=> this.addTag()}
                        >Сохранить
                        </button>
                        <button 
                          className = 'add-note-card__button button button--delete'
                          onClick={()=> this.cancelAddTag()}
                        >Отмена
                        </button>
                      </div>

    if (this.state.tags.length > 0) {
      tags = this.state.tags.map((tag, index)=> {
                return (
                  <div className='tags__item' key={index}>
                    <button 
                      className='tags__button'
                      onClick={()=> this.filterNotes(tag)}
                      disabled={this.state.isChangeNote}
                    >{tag}
                    </button>
                    <button 
                      className='tags__button'
                      onClick={()=> this.deleteTag(index)}
                      disabled={this.state.isChangeNote}
                    >x
                    </button>                    
                  </div>
                )
            })
    } else {
      tags = <h4>Теги пока не созданы! Задай их скорей! Жми на кнопку "+ Форма добавления тега"</h4>      
    }
    
    if (this.state.notes.length > 0) {
      // eslint-disable-next-line
      notes = this.state.notes.map((note, index) => { 
        if (note.active) {
          return (
            <React.Fragment key = {index}>
              <Note  
                text = {note.text}
                noteTags= {note.noteTags}
                index={index}
                onChangeNote={event => this.onChangeNote(index)}
                readonly = {note.readonly}
                onDelete={()=> this.onDelete(index)}
                onChangeText = {event => this.onChangeText(index, event.target.value)}
                onChangeTags = {event => this.onChangeTags(index, event.target.value)}
                saveChangeNote = {()=> this.saveChangeNote(index)}
                onFocusText = {event => this.onFocusText(index, event.target.innerHTML)}
                disabled={this.state.isChangeNote}
              />
            </React.Fragment>
          )
        }
      })         
    } else {
      notes = <h4>Заметок пока нет! Хочешь добавить? Жми на кнопку "+ Форма добавления заметки"</h4>      
    }    
      
    return (
        <div style={divStyle}>
          <h1>Блокнот заметок</h1>
          <div className='editing'>            
            <button 
              className='editing__button' 
              onClick={()=> this.showFieldNote()} 
              disabled={this.state.isChangeNote}
            >+ Форма добавления заметки
            </button>
            <button 
              className='editing__button' 
              onClick={()=> this.showFieldTag()}
              disabled={this.state.isChangeNote}
            >+ Форма добавления тега
            </button>
          </div>
          <hr/>
          {this.state.addTagState && addFieldTag}
          <h2> Мои теги</h2>
          <div className='tags'>
            { tags }
          </div>
          <hr/>
          {this.state.addNoteState && addField}

          <h2> Мои заметки</h2>
          <section className='notes' >
            { notes }
          </section>                   
        </div>
      );
  }
}

export default App;
