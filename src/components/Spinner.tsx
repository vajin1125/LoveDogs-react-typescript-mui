import { usePromiseTracker } from "react-promise-tracker";
import { Hearts } from 'react-loader-spinner';

export const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <> 
      {
        promiseInProgress &&
        <div
          style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Hearts 
            height="100"
            width="100"
            color="#f50057"
            ariaLabel="hearts-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      }
    </>
  );  
}