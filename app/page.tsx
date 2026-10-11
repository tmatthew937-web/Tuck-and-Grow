import {requireChatGPTUser} from './chatgpt-auth';
import BudgetApp from './budget-app';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/');return <BudgetApp/>;}
