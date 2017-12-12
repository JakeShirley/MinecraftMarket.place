import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export class SingleSelectionDropdown extends React.Component {
    constructor(props) {
        super(props);

        // Methods
        this.toggle = this.toggle.bind(this);
        this.onClick = this.onClick.bind(this);

        this.state = {
            dropdown_open: false,
        };
    }

    toggle() {
        this.setState({
            dropdown_open: !this.state.dropdown_open
        });
    }

    onClick(selectedOption) {
        this.props.select_option(selectedOption);
    }

    render() {
        let availableOptionControls = []
        let selectedOptionLabelControls = null;

        for (var optionKey in this.props.available_options) {
            let currentOption = this.props.available_options[optionKey];

            let currentOptionTextControl = [currentOption.text];
            if (this.props.selected_option === currentOption) {
                const isDefaultSort = (this.props.selected_option.current_sort === this.props.selected_option.default_sort);
                currentOptionTextControl.push(" ");
                currentOptionTextControl.push(<i className={isDefaultSort ? "fa fa-arrow-down" : "fa fa-arrow-up"} aria-hidden="true" key="Arrow"></i>);

                selectedOptionLabelControls = currentOptionTextControl;
            }

            availableOptionControls.push(<DropdownItem key={optionKey} onClick={(e) => this.onClick(currentOption)}>{currentOptionTextControl}</DropdownItem>)
        }

        return (
            <Dropdown isOpen={this.state.dropdown_open} toggle={this.toggle}>
                <DropdownToggle caret>
                    {this.props.label_prefix}{selectedOptionLabelControls}
                </DropdownToggle>
                <DropdownMenu>
                    {availableOptionControls}
                </DropdownMenu>
            </Dropdown>
        );
    }
}

export class MultiSelectionDropdown extends React.Component {
    constructor(props) {
        super(props);

        // Methods
        this.isSelected = this.isSelected.bind(this);
        this.onClick = this.onClick.bind(this);
        this.toggle = this.toggle.bind(this);

        this.state = {
            dropdown_open: false,
        };
    }

    toggle() {
        this.setState({
            dropdown_open: !this.state.dropdown_open
        });
    }

    isSelected(option) {
        return this.props.selected_options.some(item => item === option);
    }

    onClick(selectedOption) {
        // check if we're currently selected
        if(this.isSelected(selectedOption)) {
            this.props.deselect_option(selectedOption);
        }
        else {
            this.props.select_option(selectedOption);
        }
    }

    render() {
        let availableOptionControls = []

        for (var optionKey in this.props.available_options) {
            let currentOption = this.props.available_options[optionKey];

            let currentOptionTextControl = [currentOption.text];
            if (this.isSelected(currentOption)) {
                currentOptionTextControl.push(" ");
                currentOptionTextControl.push(<i className="fa fa-check" aria-hidden="true" key="Check"></i>);
            }

            availableOptionControls.push(<DropdownItem key={optionKey} onClick={(e) => this.onClick(currentOption)}>{currentOptionTextControl}</DropdownItem>)
        }

        return (
            <Dropdown isOpen={this.state.dropdown_open} toggle={this.toggle}>
                <DropdownToggle caret>
                    {this.props.label}
                </DropdownToggle>
                <DropdownMenu>
                    {availableOptionControls}
                </DropdownMenu>
            </Dropdown>
        );
    }
}
