import toast, { Toaster } from 'react-hot-toast';


const toasterSuccess = () => {
  const notify = () => toast('Here is your toast.');
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />
    </div>
  );
};
export default toasterSuccess
