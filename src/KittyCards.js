import React from "react";
import {
  Button,
  Card,
  Grid,
  Message,
  Modal,
  Form,
  Label,
} from "semantic-ui-react";

import KittyAvatar from "./KittyAvatar";
import { useSubstrateState } from "./substrate-lib";
import { TxButton } from "./substrate-lib/components";

// --- About Modal ---

const TransferModal = (props) => {
  const { kitty, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = (key) => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="blue">
          转让
        </Button>
      }
    >
      <Modal.Header>毛孩转让</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input fluid label="毛孩 ID" readOnly value={kitty.id} />
          <Form.Input
            fluid
            label="转让对象"
            placeholder="对方地址"
            onChange={formChange("target")}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => setOpen(false)}>
          取消
        </Button>
        <TxButton
          label="确认转让"
          type="SIGNED-TX"
          setStatus={setStatus}
          onClick={confirmAndClose}
          attrs={{
            palletRpc: "kittiesModule",
            callable: "transfer",
            inputParams: [kitty.id, formValue.target],
            paramFields: [true, true],
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

const BreedModal = (props) => {
  const { kitty, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = (key) => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="blue">
          繁殖
        </Button>
      }
    >
      <Modal.Header>毛孩繁殖</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input fluid label="毛孩 ID" readOnly value={kitty.id} />
          <Form.Input
            fluid
            label="繁殖对象"
            placeholder="对方ID"
            onChange={formChange("target")}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => setOpen(false)}>
          取消
        </Button>
        <TxButton
          label="确认繁殖"
          type="SIGNED-TX"
          setStatus={setStatus}
          onClick={confirmAndClose}
          attrs={{
            palletRpc: "kittiesModule",
            callable: "breed",
            inputParams: [kitty.id, formValue.target],
            paramFields: [true, true],
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

// --- About Kitty Card ---

const KittyCard = (props) => {
  const { kitty, setStatus } = props;
  const { id = null, dna = null, owner = null } = kitty;
  const displayDna = dna && dna.join(", ");
  const displayId = id === null ? "" : id < 10 ? `0${id}` : id.toString();
  const { currentAccount } = useSubstrateState();
  const isSelf = currentAccount.address === kitty.owner;

  return (
    <Card>
      {isSelf && (
        <Label as="a" floating color="teal">
          我的
        </Label>
      )}
      <KittyAvatar dna={dna.toU8a()} />
      <Card.Content>
        <Card.Header>ID 号: {displayId}</Card.Header>
        <Card.Meta style={{ overflowWrap: "break-word" }}>
          基因: <br />
          {displayDna}
        </Card.Meta>
        <Card.Description>
          <p style={{ overflowWrap: "break-word" }}>
            猫奴:
            <br />
            {owner}
          </p>
        </Card.Description>
      </Card.Content>
      <Card.Content extra style={{ textAlign: "center" }}>
        {owner === currentAccount.address ? (
          <span>
            <TransferModal kitty={kitty} setStatus={setStatus} />,
            <BreedModal kitty={kitty} setStatus={setStatus} />
          </span>
        ) : (
          ""
        )}
      </Card.Content>
    </Card>
  );
};

const KittyCards = (props) => {
  const { kitties, accountPair, setStatus } = props;

  if (kitties.length === 0) {
    return (
      <Message info>
        <Message.Header>
          现在连一只毛孩都木有，赶快创建一只&nbsp;
          <span role="img" aria-label="point-down">
            👇
          </span>
        </Message.Header>
      </Message>
    );
  }

  return (
    <Grid columns={3}>
      {kitties.map((kitty, i) => (
        <Grid.Column key={`kitty-${i}`}>
          <KittyCard
            kitty={kitty}
            accountPair={accountPair}
            setStatus={setStatus}
          />
        </Grid.Column>
      ))}
    </Grid>
  );
};

export default KittyCards;
