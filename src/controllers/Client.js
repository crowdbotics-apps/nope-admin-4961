import { Firestore } from "../lib/firebase";

export const addClient = async payload => {
  try {
    let groupIds = [];
    let tasks = payload.groups.map(group => {
      let groupDoc = Firestore.collection("participant_groups").doc();
      let participant_list = group.participant_list.map(participant => {
        return {
          name: participant[0],
          email: participant[1],
          status: true
        };
      });
      groupIds.push(groupDoc.id);
      return groupDoc.set({
        id: groupDoc.id,
        name: group.name,
        division: group.division,
        number_of_participants: group.number_of_participants,
        participant_list
      });
    });
    await Promise.all(tasks);

    let clientDoc = Firestore.collection("users").doc();
    await clientDoc.set({
      id: clientDoc.id,
      name: clientDoc.name || "",
      phone: clientDoc.phone || "",
      email: clientDoc.email
    });
  } catch (error) {
    throw error;
  }
};

export const updateClient = async payload => {
  try {
    let clientDoc = Firestore.collection("users").doc(payload.clientId);
    await clientDoc.update({
      id: payload.clientId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      status: payload.status
    });
  } catch (error) {
    throw error;
  }
};

export const deactivateClient = async clientId => {
  try {
    let clientCollection = Firestore.collection("users");
    await clientCollection.doc(clientId).update({
      status: false
    });
  } catch (error) {
    throw error;
  }
};

export const activateClient = async clientId => {
  try {
    let clientCollection = Firestore.collection("users");
    await clientCollection.doc(clientId).update({
      status: true
    });
  } catch (error) {
    throw error;
  }
};

export const getClientById = clientId =>
  new Promise((resolve, reject) => {
    let clientDoc = Firestore.collection("users").doc(clientId);
    clientDoc.onSnapshot(async snapshot => {
      let clientData = {
        id: snapshot.data().id,
        name: snapshot.data().name || "",
        email: snapshot.data().email || "",
        phone: snapshot.data().phone || ""
      };

      resolve(clientData);
    });
  });

// search clients with the criteria
export const getClients = async () => {
  let clientCollection = Firestore.collection("users");

  try {
    let snapshot = await clientCollection.get();
    let tasks = snapshot.docs.map(clientDoc => getClientById(clientDoc.id));
    let clients = Promise.all(tasks);
    return clients;
  } catch (error) {
    throw error;
  }
};
