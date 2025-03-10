import { PlusCircle } from "lucide-react";
import UIStore from "../../../../store/UIStore";
import { observer } from "mobx-react";

export const AddUserButton = observer(() => {
    return <button 
        className='chat-info__add-user-button'
        onClick={e => {
            UIStore.setAddUserWindow();
        }}
    >
        <p>Add User</p> <PlusCircle/>
    </button>
})

export default AddUserButton