import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import React from "react";

const SlidersBootstrap = () => (
  <Card>
    <CardHeader>
      <CardTitle tag="h4">Default Bootstrap 4 slider</CardTitle>
    </CardHeader>
    <CardBody>
      <FormGroup>
        <Label for="default-range">Default</Label>
        <Input type="range" name="default-range" id="default-range" />
      </FormGroup>
      <FormGroup>
        <Label for="disable-range">Disabled</Label>
        <Input type="range" name="disable-range" id="disable-range" disabled />
      </FormGroup>
    </CardBody>
  </Card>
);

export default SlidersBootstrap;
