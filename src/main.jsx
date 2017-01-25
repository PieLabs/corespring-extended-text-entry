import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { green200, green500, amber300, amber500, amber600 } from 'material-ui/styles/colors';


require('./index.less');

import CorespringExtendedTextEntry from './corespring-extended-text-entry.jsx'

class Main extends React.Component {

  //TODO: if we do decide to use the material ui theming - we should move this logic to a library this is a copy of what's in multiple-choice and ordering
  _getMuiTheme(className) {
    if (className === 'white-on-black') {
      return getMuiTheme(darkBaseTheme, {
        correctColor: green200,
        incorrectColor: amber500,
        palette: {
          textColor: 'white'
        }
      });
    } else if (className === 'black-on-rose') {
      return getMuiTheme({
        correctColor: green500,
        incorrectColor: amber600
      });
    } else {
      return getMuiTheme({
        correctColor: green500,
        incorrectColor: amber600
      });
    }
  };

  render() {

    let theme = this._getMuiTheme(this.props.model.className);
    return <div>
      <MuiThemeProvider muiTheme={theme}>
        <CorespringExtendedTextEntry
          model={this.props.model}
          session={this.props.session}
        >
        </CorespringExtendedTextEntry>
      </MuiThemeProvider>
    </div>
  }
}


export default Main;

