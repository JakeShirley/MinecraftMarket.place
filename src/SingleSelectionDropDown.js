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
                let isDefaultSort = (this.props.selected_option.current_sort === this.props.selected_option.default_sort);
                currentOptionTextControl.push(" ");
                currentOptionTextControl.push(<i className={isDefaultSort ? "fa fa-arrow-down" : "fa fa-arrow-up"} aria-hidden="true" key="Arrows"></i>);

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
/*
export class MultiSelectionDropdown extends React.Component {
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
            if (this.props.selected_option.key === currentOption.key) {
                let isSelected = (this.props.selected_option.current_sort === this.props.selected_option.default_sort);
                currentOptionTextControl.push(" ");
                currentOptionTextControl.push(<i className={isDefaultSort ? "fa fa-check" : "fa fa-arrow-up"} aria-hidden="true" key="Arrows"></i>);

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
*/