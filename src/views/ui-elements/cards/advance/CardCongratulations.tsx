import { Award } from "react-feather";

import Avatar from "@components/avatar";

import { Card, CardBody, CardText } from "reactstrap";
import decorationLeft from "@src/assets/images/elements/decore-left.png";
import decorationRight from "@src/assets/images/elements/decore-right.png";

const CardCongratulations = (data: any) => (
  
  <Card className="card-congratulations">
    
    <CardBody className="text-center">
      
      <img
        className="congratulations-img-left"
        src={decorationLeft}
        alt="decor-left"
      />
      
      <img
        className="congratulations-img-right"
        src={decorationRight}
        alt="decor-right"
      />
      
      <Avatar
        icon={<Award size={28} />}
        className="shadow"
        color="info"
        size="xl"
      />
      
      <div className="text-center">
        
        <h1 className="mb-1 text-white">Chào mừng {data.loginName},</h1>
        
        
        <CardText className="m-auto w-75">
          
          Chào mừng bạn đến với hệ thống <strong>TVSI - WORKSPACE</strong>
        </CardText>
      </div>
    </CardBody>
  </Card>
);

export default CardCongratulations;
