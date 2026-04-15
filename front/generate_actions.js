const fs = require('fs');
const path = require('path');

const models = {
  city: ['add', 'update', 'get', 'gets', 'remove', 'count'],
  file: ['getFiles', 'uploadFile'],
  province: ['add', 'update', 'get', 'gets', 'remove', 'count'],
  user: ['addUser', 'getMe', 'getUser', 'login', 'tempUser', 'updateUser', 'registerUser', 'getUsers', 'removeUser', 'countUsers', 'updateUserRelations'],
  tag: ['add', 'update', 'get', 'gets', 'remove', 'count'],
  category: ['add', 'update', 'get', 'gets', 'remove', 'count'],
  report: ['add', 'update', 'get', 'gets', 'remove', 'count']
};

const actionsDir = path.join(__dirname, 'src', 'app', 'actions');

// Create the actions directory if it doesn't exist
if (!fs.existsSync(actionsDir)) {
  fs.mkdirSync(actionsDir, { recursive: true });
}

Object.entries(models).forEach(([model, actions]) => {
  const modelDir = path.join(actionsDir, model);
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }

  actions.forEach(action => {
    const fileContent = `"use server";
import { AppApi } from "@/lib/api";
import { ReqType } from "@/types/declarations";
import { cookies } from "next/headers";

export const ${action} = async (data: ReqType["main"]["${model}"]["${action}"]["set"], getSelection: ReqType["main"]["${model}"]["${action}"]["get"] = {} as any) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  const result = await AppApi(undefined, token).send({
    service: "main",
    model: "${model}",
    act: "${action}",
    details: {
      set: data,
      get: getSelection,
    },
  });

  if (result.success) return result.body;
  return null;
};
`;

    const filePath = path.join(modelDir, `${action}.ts`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, fileContent);
      console.log(`Created ${filePath}`);
    }
  });
});
