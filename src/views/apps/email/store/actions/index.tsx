import axios from "axios";

// ** GET Mails
export const getMails = (params: any) => (dispatch: any) =>
  axios.get("/apps/email/emails", { params }).then((res) => {
    dispatch({ type: "GET_MAILS", data: res.data, params });
  });

// ** UPDATE Mails
export const updateMails =
  (emailIds: any, dataToUpdate: any) => (dispatch: any, getState: any) =>
    axios
      .post("/apps/email/update-emails", { emailIds, dataToUpdate })
      .then((res) => {
        dispatch({
          type: "UPDATE_MAILS",
          emailIds,
          dataToUpdate,
          data: res.data,
        });
        dispatch(getMails(getState().email.params));
      });

// ** Update Mail Label
export const updateMailLabel =
  (emailIds: any, label: any) => (dispatch: any, getState: any) =>
    axios
      .post("/apps/email/update-emails-label", { emailIds, label })
      .then((res) => {
        dispatch({ type: "UPDATE_MAIL_LABEL", data: res.data });
        dispatch(getMails(getState().email.params));
      });

// ** GET Next/Prev mail
export const paginateMail = (dir: any, emailId: any) => (dispatch: any) =>
  axios
    .get("/apps/email/paginate-email", { params: { dir, emailId } })
    .then((res) => {
      dispatch({ type: "PAGINATE_MAIL", data: res.data });
    });

// ** SELECT Current Mail
export const selectCurrentMail = (id: any) => (dispatch: any) =>
  
  axios.get("/apps/email/get-email", { id }).then((res) => {
    dispatch({ type: "SELECT_CURRENT_MAIL", mail: res.data });
  });

// ** SELECT Mail
export const selectMail = (id: any) => (dispatch: any) =>
  dispatch({ type: "SELECT_MAIL", id });

// ** SELECT All Mails
export const selectAllMail = (val: any) => (dispatch: any) =>
  dispatch({ type: "SELECT_ALL_MAIL", val });

// ** RESET Selected Mails
export const resetSelectedMail = () => (dispatch: any) =>
  dispatch({ type: "RESET_SELECT_MAILS" });
