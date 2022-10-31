
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Input,
} from "reactstrap";

const TextareaDefault = () => (
  <Card>
    <CardHeader>
      
      <CardTitle tag="h4">Default</CardTitle>
    </CardHeader>

    <CardBody>
      <CardText>
        
        create a Textarea use <code>type="textarea"</code> with reactstrap Input
        tag.
      </CardText>
      
      <Input
        type="textarea"
        name="text"
        id="exampleText"
        rows="3"
        placeholder="Textarea"
      />
    </CardBody>
  </Card>
);
export default TextareaDefault;
