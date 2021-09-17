import React from 'react';
import './note.scss';
import ContentEditable from 'react-contenteditable';
import withClass from '../hoc/withclass';

class Note extends React.Component {	
	
	constructor() {
		super()
		this.contentEditable = React.createRef();
	};
	
	render () {
		const inputClasses=['input'];
		if (!this.props.readonly) {
			inputClasses.push('bold');
		}

		return (
			<React.Fragment>
				{!this.props.readonly && <p>Отредактируйте текст заметки</p>}
				<ContentEditable
					innerRef={this.contentEditable}
					disabled={this.props.readonly}
					onChange={this.props.onChangeText} 
					onFocus={this.props.onFocusText}
					html={this.props.text}
					className={inputClasses.join(' ')}
				></ContentEditable> 
				{!this.props.readonly && <p>Отредактируйте теги по шаблону:#тег1, #тег2, ...</p>}
				
				<span>ТЕГИ:</span>
				<textarea 
					value ={this.props.noteTags.join(', ')}
					readOnly={this.props.readonly}
					className={inputClasses.join(' ')}
					onChange={this.props.onChangeTags}
				/>
				
				<div className='Note__button-block'>
					{!this.props.readonly && <button 
												className = 'Note__button button button--save' 
												onClick={this.props.saveChangeNote}
											>Сохранить
											</button>}
					{this.props.readonly && <button 
												className = 'Note__button button button--save' 
												onClick={this.props.onChangeNote}
												disabled = {this.props.disabled}
											>Редактировать
											</button>}
					{this.props.readonly && 
					<button className = 'Note__button button button--delete' onClick={this.props.onDelete}>Удалить</button>}
				</div>
			</React.Fragment>
		)
	}
}

export default withClass(Note, 'Note')