import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { connect } from 'react-redux';
import makeAnimated from 'react-select/lib/animated';
import { withTheme } from 'styled-components';

import actions from '../../actions';
import { Label } from '../Input';

const selectStyles = {
  container: (base) => ({ ...base }),
  multiValue: (base, state) => (state.data.isFixed
    ? { ...base, backgroundColor: '#FAFAFA', border: '1px solid #A4A4A4' }
    : { ...base, backgroundColor: 'transparent', border: '1px solid #3F3844' }),
  multiValueLabel: (base, state) => (state.data.isFixed
    ? { ...base, paddingRight: 6, color: '#A4A4A4' }
    : base),
  multiValueRemove: (base, state) => (state.data.isFixed ? { ...base, display: 'none' } : base)
};

class ColumnHeadersSelect extends Component {
  constructor(props) {
    super(props);

    this.issueHeaders = [
      { label: 'Id', isFixed: true, value: 'id' },
      { label: 'Project', value: 'project.name' },
      { label: 'Tracker', value: 'tracker.name' },
      { label: 'Status', value: 'status.name' },
      { label: 'Subject', isFixed: true, value: 'subject' },
      { label: 'Priority', value: 'priority.name' },
      { label: 'Estimation', value: 'estimated_hours' },
      { label: 'Due Date', value: 'due_date' }
    ];
  }

  onHeadersSelectChange = (value, { action, removedValue }) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
        if (removedValue.isFixed) {
          return;
        }
        break;
      default:
        return;
    }

    const { settingsChangeIssueHeaders } = this.props;
    settingsChangeIssueHeaders(value);
  }

  render() {
    const { theme, issueHeaders } = this.props;
    return (
      <Label htmlFor="headers" label="Table Columns">
        <Select
          name="headers"
          styles={selectStyles}
          components={makeAnimated()}
          options={this.issueHeaders}
          defaultValue={issueHeaders}
          value={issueHeaders}
          onChange={this.onHeadersSelectChange}
          isMulti={true}
          isClearable={false}
          theme={(defaultTheme) => ({
            ...defaultTheme,
            borderRadius: 3,
            colors: {
              ...defaultTheme.colors,
              primary: theme.main,
            },
          })}
        />
      </Label>
    );
  }
}

ColumnHeadersSelect.propTypes = {
  issueHeaders: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isFixed: PropTypes.bool
  }).isRequired).isRequired,
  settingsChangeIssueHeaders: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  issueHeaders: state.settings.issueHeaders,
});

const mapDispatchToProps = (dispatch) => ({
  settingsChangeIssueHeaders: (issueHeaders) => dispatch(actions.settings.setIssueHeaders(issueHeaders))
});

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(ColumnHeadersSelect));
