import { Firestore } from "../lib/firebase";
import uuid from "uuid/v4";

let collection = Firestore.collection("block_numbers");

export const addCampaign = async payload => {
  try {
    const id = uuid();
    let data = {
      id: id,
      phone: payload.phone,
      calls: payload.calls,
      yeps: payload.yeps,
      nopes: payload.nopes,
      blockByAdmin: payload.blockByAdmin,
      blocks: []
    };

    let campaignDoc = collection.doc(id);
    await campaignDoc.set(data);
  } catch (error) {
    throw error;
  }
};

export const getPhoneNumberById = clientId =>
  new Promise((resolve, reject) => {
    let clientDoc = collection.doc(clientId);
    clientDoc.onSnapshot(async snapshot => {
      let clientData = snapshot.data();

      resolve(clientData);
    });
  });

export const getCampaigns = async () => {
  try {
    let snapshot = await collection.get();
    let tasks = snapshot.docs.map(clientDoc =>
      getPhoneNumberById(clientDoc.id)
    );
    let numbers = Promise.all(tasks);
    return numbers;
  } catch (error) {
    throw error;
  }
};

export const deactivateCampaign = async campaignId => {
  // let newblocks = [];
  // for (let i = 0; i < 10; i++) {
  //   newblocks.push({
  //     reporter_id: "admin",
  //     date: new Date()
  //   });
  // }
  try {
    await collection.doc(campaignId).update({
      blockByAdmin: true
    });
  } catch (error) {
    throw error;
  }
};

export const activateCampaign = async campaignId => {
  try {
    await collection.doc(campaignId).update({
      nopes: 0,
      blockByAdmin: false
    });
  } catch (error) {
    throw error;
  }
};
