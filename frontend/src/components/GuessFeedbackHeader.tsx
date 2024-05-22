import { Card, CardBody } from "@nextui-org/react";

export const GuessFeedbackHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-24 sm:h-12">
          <p className="text-xs text-white/90">Character</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Gender</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Origin</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Fruit</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Status</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Debut Saga</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Bounty</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Height</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="sm:w-24 w-20 text-center flex flex-row justify-center items-center h-10 sm:h-12">
          <p className="text-xs text-white/90">Age</p>
        </CardBody>
      </Card>
    </div>
  );
};
