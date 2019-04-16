import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import showdown from 'showdown';
import FormatBoldIcon from 'mdi-react/FormatBoldIcon';
import FormatItalicIcon from 'mdi-react/FormatItalicIcon';
import FormatUnderlineIcon from 'mdi-react/FormatUnderlineIcon';
import FormatStrikethroughIcon from 'mdi-react/FormatStrikethroughIcon';
import CodeTagsIcon from 'mdi-react/CodeTagsIcon';
import FormatHeader1Icon from 'mdi-react/FormatHeader1Icon';
import FormatHeader2Icon from 'mdi-react/FormatHeader2Icon';
import FormatHeader3Icon from 'mdi-react/FormatHeader3Icon';
import FormatListBulletedIcon from 'mdi-react/FormatListBulletedIcon';
import FormatListNumberedIcon from 'mdi-react/FormatListNumberedIcon';
import FormatQuoteCloseIcon from 'mdi-react/FormatQuoteCloseIcon';
import LinkVariantIcon from 'mdi-react/LinkVariantIcon';
import ImageOutlineIcon from 'mdi-react/ImageOutlineIcon';
import PageNextOutlineIcon from 'mdi-react/PageNextOutlineIcon';

import { openExternalUrl, xssFilter } from '../../modules/utils';

import TextArea from './TextArea';

const MarkdownOptionsList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 5px 0px;
`;

const MarkdownOption = styled.li`
  display: inline;
  margin-right: 10px;

  &:hover {
    cursor: pointer;
  }

  svg {
    vertical-align: middle;
  }
`;

const ModifiedTextArea = styled(TextArea)`
  width: ${props => props.preview ? '47%' : '100%'}
`;

const converter = new showdown.Converter({
  strikethrough: true,
  tables: true,
  tasklists: true,
  smoothLivePreview: true,
  disableForced4SpacesIndentedSublists: true,
  simpleLineBreaks: true,
  emoji: true,
  metadata: true
});

class MarkdownEditor extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: props.initialValue,
      textareaHeight: 15,
      showPreview: props.preview
    };

    this.textareaRef = React.createRef();
  }

  componentDidUpdate(oldProps) {
    if (this.props.initialValue !== oldProps.initialValue) {
      this.setState({
        value: this.props.initialValue
      });
    }
  }

  applyMarkdown = (symbolStart, symbolEnd) => {
    const { onChange } = this.props;
    const textarea = this.textareaRef.current;
    const currentValue = this.state.value;
    let newValue;
    if (textarea.selectionStart === textarea.selectionEnd) {
      this.adjustTextAreaHeight();
      newValue = `${currentValue.substring(0, textarea.selectionStart)}${symbolStart}${symbolEnd}${currentValue.substring(textarea.selectionStart)}`;
      this.setState({
        value: newValue 
      }, () => this.adjustTextAreaHeight());
      onChange(newValue);
    } else {
      newValue = `${currentValue.substring(0, textarea.selectionStart)}${symbolStart}${currentValue.substring(textarea.selectionStart, textarea.selectionEnd)}${symbolEnd}${currentValue.substring(textarea.selectionEnd)}`;
      this.setState({
        value: newValue
      }, () => this.adjustTextAreaHeight());
      onChange(newValue);
    }
  }

  makeBold = () => {
    this.applyMarkdown('**', '**');
  }

  makeItalic = () => {
    this.applyMarkdown('*', '*');
  }

  makeUnderlined = () => {
    this.applyMarkdown('_', '_');
  }

  makeStrikethrough = () => {
    this.applyMarkdown('~~', '~~');
  }
  
  makeCode = () => {
    this.applyMarkdown('\r\n```\r\n', '\r\n```\r\n');
  }

  makeh1 = () => {
    this.applyMarkdown('# ', '');
  }

  makeh2 = () => {
    this.applyMarkdown('## ', '');
  }

  makeh3 = () => {
    this.applyMarkdown('### ', '');
  }

  makeBulletedList = () => {
    this.applyMarkdown('- ', '');
  }

  makeNumberedList = () => {
    this.applyMarkdown('1. ', '');
  }

  makeQuote = () => {
    this.applyMarkdown('> ', '');
  }

  makeLink = () => {
    this.applyMarkdown('[', '](url)');
  }

  makeImage = () => {
    this.applyMarkdown('![', '](image-url)');
  }

  adjustTextAreaHeight = () => {
    const element = this.textareaRef.current;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
    this.setState({
      textareaHeight: element.style.height
    });
  }

  onTextAreaTyped = (e) => {
    this.setState({
      value: e.target.value
    });
    this.props.onChange(e.target.value);
    this.adjustTextAreaHeight();
  }

  togglePreview = () => {
    this.setState({
      showPreview: !this.state.showPreview
    });
  }


  // https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax
  render() {
    const { className, id } = this.props;
    const { value, textareaHeight, showPreview } = this.state;
    console.log('textareaHeight', textareaHeight);
    return (
      <div
        className={className}
        id={id}
      >
        <MarkdownOptionsList>
          <MarkdownOption onClick={this.makeBold}><FormatBoldIcon /></MarkdownOption>
          <MarkdownOption onClick={this.makeItalic}><FormatItalicIcon /></MarkdownOption>
          <MarkdownOption onClick={this.makeUnderlined}><FormatUnderlineIcon /></MarkdownOption>
          <MarkdownOption onClick={this.makeStrikethrough}><FormatStrikethroughIcon /></MarkdownOption>
          <MarkdownOption onClick={this.makeCode}><CodeTagsIcon /></MarkdownOption>
          <MarkdownOption onClick={this.makeh1}><FormatHeader1Icon /></MarkdownOption>
          <MarkdownOption onClick={this.makeh2}><FormatHeader2Icon /></MarkdownOption>
          <MarkdownOption onClick={this.makeh3}><FormatHeader3Icon /></MarkdownOption>
          <MarkdownOption onClick={this.makeBulletedList}><FormatListBulletedIcon /></MarkdownOption>
          <MarkdownOption onClick={this.makeNumberedList}><FormatListNumberedIcon /></MarkdownOption>
          <MarkdownOption onClick={this.makeQuote}><FormatQuoteCloseIcon /></MarkdownOption>
          <MarkdownOption onClick={this.makeLink}><LinkVariantIcon /></MarkdownOption>
          <MarkdownOption onClick={this.makeImage}><ImageOutlineIcon /></MarkdownOption>
          <MarkdownOption onClick={this.togglePreview}><PageNextOutlineIcon /></MarkdownOption>
        </MarkdownOptionsList>
        { showPreview
          ? (
            <MarkdownText markdownText={value} />
          )
          : (
            <ModifiedTextArea
              ref={this.textareaRef}
              onChange={this.onTextAreaTyped}
              value={value}
              preview={showPreview}
            />
          )
        }
      </div>
    );
  }
}

MarkdownEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  initialValue: PropTypes.string,
  preview: PropTypes.bool
};

MarkdownEditor.defaultProps = {
  className: undefined,
  id: undefined,
  initialValue: '',
  preview: false
};


class MarkdownText extends Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();

    const { theme } = props;
    this.genericStyles = `
      body {
        margin: 0;
        font-family: Roboto,-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,sans-serif;
        font-size: 14px;
        color: ${theme.normalText};
      }

      a {
        color: ${theme.main};
        font-size: 14px;
        padding: 2px;
        cursor: pointer;
      }

      a:hover {
        background: ${theme.main};
        color: ${theme.hoverText};
      }
    `;
  }

  interceptIframeRedirect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openExternalUrl(e.target.href);
  }

  adjustIframe = () => {
    const iframe = this.iframeRef.current;
    if (iframe) {
      iframe.height = iframe.contentDocument.body.scrollHeight + 30;
      const css = document.createElement('style');
      css.type = 'text/css';
      css.innerText = this.genericStyles;
      iframe.contentDocument.head.appendChild(css);
      for (const elem of iframe.contentDocument.body.querySelectorAll(['a', 'img', 'button', 'input'])) {
        elem.removeEventListener('click', this.interceptIframeRedirect);
        elem.addEventListener('click', this.interceptIframeRedirect);
      }
    }
  }

  render () {
    const { markdownText, className } = this.props;
    const markdown = xssFilter(converter.makeHtml(markdownText));
    return (
      <iframe
        ref={this.iframeRef}
        className={className}
        frameBorder="0"
        width="100%"
        srcDoc={markdown}
        onLoad={this.adjustIframe}
      />
    );
  }
};

MarkdownText.propTypes = {
  markdownText: PropTypes.string,
  className: PropTypes.string
};

MarkdownText.defaultProps = {
  markdownText: undefined,
  className: undefined
};

MarkdownText = withTheme(MarkdownText);

export {
  MarkdownText
};

export default MarkdownEditor;