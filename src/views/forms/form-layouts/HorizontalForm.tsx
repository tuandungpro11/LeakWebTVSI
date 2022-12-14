import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Col,
  Input,
  Form,
  Button,
  CustomInput,
  Label,
  
} from "reactstrap";

const HorizontalForm = () => (
  <Card>
    <CardHeader>
      
      <CardTitle tag="h4">Horizontal Form</CardTitle>
    </CardHeader>

    <CardBody>
      <Form>
        
        <FormGroup row>
          
          <Label sm="6" for="name">
            
           First Name
          </Label>
          
          <Col sm="18">
            
            <Input type="text" name="name" id="name" placeholder="First Name" />
          </Col>
        </FormGroup>
        
        <FormGroup row>
          
          <Label sm="6" for="Email">
            
            Email
          </Label>
          
          <Col sm="18">
            
            <Input type="email" name="Email" id="Email" placeholder="Email" />
          </Col>
        </FormGroup>
        
        <FormGroup row>
          
          <Label sm="6" for="mobile">
            
           Mobile
          </Label>
          
          <Col sm="18">
            
            <Input
              type="number"
              name="mobile"
              id="mobile"
              placeholder="Mobile"
            />
          </Col>
        </FormGroup>
        
        <FormGroup row>
          
          <Label sm="6" for="password">
            
             Password
          </Label>
          
          <Col sm="18">
            
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
          </Col>
        </FormGroup>
        
        <FormGroup row>
          
          <Col md={{ size: 18, offset: 6 }}>
            
            <CustomInput
              type="checkbox"
              id="remember-me"
              label="Remember Me"
              defaultChecked={false}
            />
          </Col>
        </FormGroup>
        
        
        <FormGroup className="mb-0" row>
          
          
          <Col className="d-flex" md={{ size: 18, offset: 6 }}>
            
            
            <Button.Ripple
              className="mr-1"
              color="primary"
              type="submit"
              onClick={(e) => e.preventDefault()}
            >
              Submit
            </Button.Ripple>
            <Button.Ripple outline color="secondary" type="reset">
              
             Reset
            </Button.Ripple>
          </Col>
        </FormGroup>
      </Form>
    </CardBody>
  </Card>
);
export default HorizontalForm;
