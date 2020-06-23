// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { Button, Modal } from "@skbkontur/react-ui";
import ModalError from "../Components/ModalError/ModalError";

const ERROR_MESSAGE = `File empty.json cannot be converted to subscription. Unexpected end of JSON input`;
const Wrapper = ({ children, init }) => {
    const [message, setMessage] = useState(init ? ERROR_MESSAGE : undefined);
    const handleView = () => {
        setMessage(message ? undefined : ERROR_MESSAGE);
    };
    return children(message, handleView);
};

storiesOf("FooterError", module)
    .add("Hide", () => {
        return (
            <Wrapper>
                {(message, handleClick) => (
                    <Modal>
                        <Modal.Header>Error panel</Modal.Header>
                        <Modal.Body />
                        <Modal.Footer>
                            <ModalError message={message} />
                            <Button onClick={handleClick}>Error</Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </Wrapper>
        );
    })
    .add("Show", () => {
        return (
            <Wrapper init>
                {(message, handleClick) => (
                    <Modal>
                        <Modal.Header>Error panel</Modal.Header>
                        <Modal.Body />
                        <Modal.Footer>
                            <ModalError message={message} />
                            <Button onClick={handleClick}>Error</Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </Wrapper>
        );
    });
