import { Button } from "@material-ui/core";
import React from "react";
import styledComponents from "styled-components";

const TextField = styledComponents.input`
	height: 32px;
	width: 200px;
	border-radius: 3px;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border: 1px solid #e5e5e5;
	padding: 0 32px 0 16px;
	margin-top: 20px;

	&:hover {
		cursor: pointer;
	}
`;

const ClearButton = styledComponents(Button)`
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	height: 34px;
	width: 32px;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fc4b6c;
	color: #FFFFFF;
	margin-top: 20px;

	&:hover {
		background-color: #fc4b6c;
	}
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Search"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" color="primary" onClick={onClear}>
      X
    </ClearButton>
  </>
);

export default FilterComponent;