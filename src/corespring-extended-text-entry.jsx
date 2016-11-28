import React from 'react'
import _ from 'lodash'
import {Editor, EditorState, RichUtils} from 'draft-js'


export class CorespringExtendedTextEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }


  render() {
    const {editorState} = this.state;

    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    let buttonBar = this.props.model.disabled ? null : <div className="RichEditor-button-bar">
      <InlineStyleControls
        editorState={editorState}
        onToggle={this.toggleInlineStyle}
      />

      <BlockStyleControls
        editorState={editorState}
        onToggle={this.toggleBlockType}
      />
    </div>;

    let rootClassName = "RichEditor-root" + (this.props.model.disabled ? ' disabled' : '');
    return (
      <div className={rootClassName}>
        {buttonBar}
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            readOnly={this.props.model.disabled}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder=""
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.children}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: <i className="fa fa-list-ul"></i>, style: 'unordered-list-item'},
  {label: <i className="fa fa-list-ol"></i>, style: 'ordered-list-item'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.style}
          active={type.style === blockType}
          onToggle={props.onToggle}
          style={type.style}
        >
          {type.label}
        </StyleButton>
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: <i className="fa fa-bold"></i>, style: 'BOLD'},
  {label: <i className="fa fa-italic"></i>, style: 'ITALIC'},
  {label: <i className="fa fa-underline"></i>, style: 'UNDERLINE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          onToggle={props.onToggle}
          style={type.style}
        >
          {type.label}
        </StyleButton>
      )}
    </div>
  );
};


export default CorespringExtendedTextEntry;