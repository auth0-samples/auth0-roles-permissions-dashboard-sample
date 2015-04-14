var React = require('react');
var BS = require('react-bootstrap');

export class TextInput extends React.Component {
  render() {
    return (
      <div className="form-group">
        <label htmlFor="inputName" className="col-lg-2 control-label">{this.props.label}</label>
        <div className="col-lg-10">
          <input type="text" className="form-control" name={this.props.name} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange} disabled={this.props.disabled} />
        </div>
      </div>
    );
  }
}
export class Select extends React.Component {
  render() {
    return (
      <div className="form-group">
        <label className="col-lg-2 control-label">{this.props.label}</label>
        <div className="col-lg-10">
          <select name={this.props.name} value={this.props.value} onChange={this.props.onChange} className="form-control" type="select">
            <option></option>
            {this.props.items.map((item, i) => { 
              return (<option value={item.key} key={item.key}>{item.label}</option>); 
            })}
          </select>
        </div>
      </div>
    );
  }
}

export class Checkbox extends React.Component {
  render() {
    return (
      <div className="form-group">
        <div className="col-lg-2"></div>
        <div className="checkbox col-lg-10">
           <label>
            <input type="checkbox" name={this.props.name} checked={this.props.checked} onChange={this.props.onChange} />
            {this.props.label}
           </label>
        </div>
      </div>
    );
  }
}

export class CheckboxSimple extends React.Component {
  render() {
    return (
      <div className="form-group">
        <div className="checkbox">
           <label>
            <input type="checkbox" name={this.props.name} checked={this.props.checked} onChange={this.props.onChange} />
            {this.props.label}
           </label>
        </div>
      </div>
    );
  }
}


export class RadioGroup extends React.Component {
  render() {
    return (
      <div className="form-group">
        <label className="col-lg-2 control-label">{this.props.label}</label>
        <div className="col-lg-10">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export class Radio extends React.Component {
  render() {
    return (
      <div className="radio">
        <label>
          <input type="radio" name={this.props.name} value={this.props.value} checked={this.props.checked} onChange={this.props.onChange} />
          {this.props.label}
        </label>
      </div>
    );
  }
}
