import * as React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Typography, TextField } from '@material-ui/core';
import { Dialog } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import withRoot from '../withRoot';
import Api from '../func/api';
import resources from '../settings/api.json';
import env from '../settings/env.json';
import { Resource, Method, MethodName } from '../data-types/resource';
import TestDialog from './test-dialog';

const styles = (theme: Theme) => createStyles({
  root: {
    textAlign: 'center',
    padding: theme.spacing.unit * 3,
  }
});

type State = {
  open: {r: Resource, m: Method} | null;
  request: string;
  responseStatus: string;
  responseBody: string;
};

class Index extends React.Component<WithStyles<typeof styles>, State> {

  constructor(props: WithStyles<typeof styles>) {
    super(props);
    this.state = { open: null, request: '', responseStatus: '', responseBody: '' };
  }

  handleClose = () => this.setState({ open: null });

  handleClick = (r: Resource, m: Method) => () =>  this.setState({ open: {r, m} });

  test = () => {
    if (this.state.open === null) { throw 'error'; }
    const { r, m } = this.state.open;
    const api = new Api()
    const url = api.getExampleUrl(r.name, m.name);
    api.send(m.name as MethodName, url, JSON.parse(this.state.request))
    .then((res) => { this.setState({responseStatus: String(res.status)}); return res; })
    .then((res) => res.text().then((text) => this.setState({responseBody: text})));
  }

  render() {
    const api = new Api();
    return (
      <div className={this.props.classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={5}><TextField placeholder="BaseURL" value={env.baseURL} fullWidth></TextField></TableCell>
            </TableRow>
            <TableRow>
              <TableCell padding="none">Resource</TableCell>
              <TableCell padding="none">Method</TableCell>
              <TableCell padding="none">URL Format</TableCell>
              <TableCell padding="none">Example URL</TableCell>
              <TableCell>Try Test</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((r, rIndex) => (
              r.methods.map((m, mIndex) => (
                mIndex === 0
                  ?
                  <TableRow key={rIndex}>
                    <TableCell padding="none" rowSpan={r.methods.length}>
                      {r.name
                        .split('-')
                        .map(t => t.charAt(0).toUpperCase() + t.slice(1))
                        .reduce((a, b) => a + ' ' + b)}
                    </TableCell>
                    <TableCell padding="none">
                      {m.name}
                    </TableCell>
                    <TableCell padding="none">{m.url}</TableCell>
                    <TableCell padding="none">{api.getExampleUrl(r.name, m.name)}</TableCell>
                    <TableCell><Button onClick={this.handleClick(r, m)}>Open</Button></TableCell>
                  </TableRow>
                  :
                  <TableRow key={rIndex}>
                    <TableCell padding="none">
                      {m.name}
                    </TableCell>
                    <TableCell padding="none">{m.url}</TableCell>
                    <TableCell padding="none">{api.getExampleUrl(r.name, m.name)}</TableCell>
                    <TableCell><Button onClick={this.handleClick(r, m)}>Open</Button></TableCell>
                  </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
        <Dialog
          fullWidth
          maxWidth="sm"
          onClose={this.handleClose}
          open={this.state.open !== null}
        >
        {this.state.open !== null && <TestDialog r={this.state.open.r} m={this.state.open.m}/>}
        </Dialog>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(Index));
