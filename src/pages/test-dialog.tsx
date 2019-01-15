import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Send } from '@material-ui/icons';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import withRoot from '../withRoot';
import Api from '../func/api';
import { Resource, Method, MethodName } from '../data-types/resource';

const titleStyles = (theme: Theme) => createStyles({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  testButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit * 1.5,
    color: theme.palette.grey[500],
  }
});

interface TitleProps {
  children: React.ReactNode;
  test: () => void;
}

const DialogTitle = withStyles(titleStyles)((props: TitleProps & WithStyles<typeof titleStyles>) => {
  const { children, test, classes } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      <Button className={classes.testButton} onClick={test}>
        Test<Send />
      </Button>
    </MuiDialogTitle>
  );
});

const styles = (theme: Theme) => createStyles({
  textField: {
    marginBottom: theme.spacing.unit * 2
  },
  green: {color: 'green'},
  red  : {color: 'red'}
});

interface Props {
  r: Resource;
  m: Method;
}

type State = {
  requestBody: string;
  responseStatus: string;
  responseBody: string;
};

class Index extends React.Component<Props & WithStyles<typeof styles>, State> {

  constructor(props: Props & WithStyles<typeof styles>) {
    super(props);
    this.state = {
      requestBody: props.m.exampleRequestBody ? props.m.exampleRequestBody : '',
      responseStatus: '',
      responseBody: ''
    };
  }

  onChange = (e: any) => this.setState({ requestBody: e.target.value });

  test = () => {
    const { r, m } = this.props;
    const { requestBody } = this.state;
    const api = new Api()
    const url = api.getExampleUrl(r.name, m.name);
    api.send(m.name as MethodName, url, JSON.parse(requestBody))
      .then((res) => { this.setState({ responseStatus: String(res.status) }); return res; })
      .then((res) => res.text().then((text) => this.setState({ responseBody: text })));
  }

  render() {
    const api = new Api();
    const { r, m, classes } = this.props;
    const { requestBody, responseStatus, responseBody } = this.state;
    return (
      <React.Fragment>
        <DialogTitle test={this.test}>
          Test: {api.getExampleUrl(r.name, m.name)}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6">Reqest Body</Typography>
          <TextField
            className={classes.textField}
            value={requestBody}
            fullWidth
            multiline
            rows={4}
            rowsMax={12}
            onChange={this.onChange}
          />
          <Typography variant="h6">
            Status Code:
            <span className={responseStatus === '200' ? classes.green : classes.red}> {responseStatus}</span>
          </Typography>
          <Typography variant="h6">Response Body</Typography>
          <Typography gutterBottom>{responseBody}</Typography>
        </DialogContent>
      </React.Fragment>
    );
  }
}

export default withRoot(withStyles(styles)(Index));
