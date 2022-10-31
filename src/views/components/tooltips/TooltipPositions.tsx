
import { Button, UncontrolledTooltip } from "reactstrap";

const TooltipPosition = () => (
  
  <div className="demo-inline-spacing">
    
    <Button.Ripple color="primary" outline id="positionTop">
      
      you mean 'top'? Top
    </Button.Ripple>
    
    <UncontrolledTooltip placement="top" target="positionTop">
      
      Tooltip on Top
    </UncontrolledTooltip>
    
    <Button.Ripple color="primary" outline id="positionRight">
      
      Right
    </Button.Ripple>
    
    <UncontrolledTooltip placement="right" target="positionRight">
      
      Tooltip on Right
    </UncontrolledTooltip>
    
    <Button.Ripple color="primary" outline id="positionBottom">
      
      Bottom
    </Button.Ripple>
    
    <UncontrolledTooltip placement="bottom" target="positionBottom">
      
      Tooltip on Bottom
    </UncontrolledTooltip>
    
    <Button.Ripple color="primary" outline id="positionLeft">
      
    </Button.Ripple>
    
    <UncontrolledTooltip placement="left" target="positionLeft">
      
      Tooltip on Left
    </UncontrolledTooltip>
  </div>
);
export default TooltipPosition;
