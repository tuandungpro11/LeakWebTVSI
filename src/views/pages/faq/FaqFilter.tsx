import { Search } from "react-feather";
import {
  Card,
  CardBody,
  CardText,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import React from "react";

const FaqFilter = ({ searchTerm, setSearchTerm, getFAQData }: any) => {
  const handleFaqFilter = (e: any) => {
    setSearchTerm(e.target.value);
    getFAQData(e.target.value);
  };

  return (
    <div id="faq-search-filter">
      <Card
        className="faq-search"
        style={{
          backgroundImage: `url(${
            require("@src/assets/images/banner/banner.png").default
          })`,
        }}
      >
        <CardBody className="text-center">
          <h2 className="text-primary">Let's answer some questions</h2>
          <CardText className="mb-2">
            or choose a category to quickly find the help you need
          </CardText>
          <Form
            className="faq-search-input"
            onSubmit={(e) => e.preventDefault()}
          >
            <InputGroup className="input-group-merge">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <Search size={14} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                value={searchTerm}
                onChange={(e) => handleFaqFilter(e)}
                placeholder="search faq..."
              />
            </InputGroup>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default FaqFilter;
