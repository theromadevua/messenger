import express from 'express'
import UserController from '../controllers/user-controller.js';
import authenticateToken from '../middlewares/auth-middleware.js';
import chatController from '../controllers/chat-controller.js';
import mediaController from '../controllers/media-controller.js';
const router = express.Router();

//login
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.post('/registration', UserController.registration);
router.get('/refresh', UserController.refresh); 


//chat
router.post('/setChatWallpaper/:chat_id', authenticateToken, chatController.setChatWallpaper);
router.get('/getChatById/:chat_id', authenticateToken, chatController.getChatById); 
router.post('/addUser/:chat_id', authenticateToken, chatController.addUser)
router.post('/joinChat/:chat_id', authenticateToken, chatController.joinChat)
router.post('/editChat/:chat_id', authenticateToken, chatController.editChat);
router.post('/getChatHistory/:chat_id', chatController.getChatHistory);
router.post('/getMessagesUntilTarget', chatController.getMessagesUntilTarget);
router.post('/createChat', authenticateToken, chatController.createChat);
router.get('/getUserChats', authenticateToken, chatController.getUserChats);
router.get('/searchChatsAndUsers', authenticateToken, chatController.searchChatsAndUsers);
router.post('/assignAdmin/:memberId', authenticateToken, chatController.assignAdmin);
router.post('/dismissAdmin/:memberId', authenticateToken, chatController.dismissAdmin);
router.delete('/deleteChat', authenticateToken, chatController.deleteChat);
router.delete('/leaveChat/:chat_id', authenticateToken, chatController.leaveChat);
//message


//file
router.post('/uploadFile', mediaController.uploadFile);

//user
router.get('/getUser/:id', UserController.getUser)
router.get('/searchUsers', UserController.searchUsers)
router.post('/changeProfile', authenticateToken, UserController.changeProfile)



export default router