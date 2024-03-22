import { FormEvent, useState } from "react";
import Loading from "./components/Loading";
import classNames from "classnames";

function App() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [hover, setHover] = useState<boolean>(false);

  const onSubmitHandler = async (event: FormEvent) => {
    try {
      event.preventDefault();
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/v1/images/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: imageUrl }),
        }
      );

      const data = await response.json();
      setResult(data.result);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setResult((error as Error).message);
    }
  };

  const onChangeHandler = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const urlRegex = new RegExp(
      "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*\\/?$"
    );

    if (!urlRegex.test(value)) {
      alert("Please enter a valid URL");
      return;
    }

    if (value !== imageUrl) setResult("");
    setImageUrl(value);
  };

  const onHoverHandler = (event: React.MouseEvent) => {
    event.type === "mouseover" ? setHover(true) : setHover(false);
  };

  return (
    <main className="h-screen bg-zinc-900 flex items-center justify-center">
      <div className="bg-white rounded-sm p-6 lg:w-4/12 xl:w-3/12">
        <h1 className="text-4xl text-center text-zinc-800 font-bold mb-8">
          Image Analyzer
        </h1>
        <form onSubmit={onSubmitHandler} className="w-full">
          {imageUrl && (
            <div
              className="relative mb-6 w-full rounded-sm overflow-hidden"
              onMouseOver={onHoverHandler}
              onMouseOut={onHoverHandler}
            >
              <img
                src={imageUrl}
                alt="Analyzed Image"
                className="w-full rounded-md"
              />
              {result && (
                <div
                  className={classNames(
                    "absolute top-0 left-0 right-0 bottom-0 bg-zinc-900/95 transition-all duration-200 ease-out flex items-center justify-center text-white p-6 text-xl text-justify cursor-pointer",
                    {
                      "opacity-0": hover,
                      "opacity-100": !hover,
                    }
                  )}
                >
                  {result}
                </div>
              )}
            </div>
          )}
          <div className="mb-4">
            <input
              type="text"
              className="border border-zinc-400 px-4 py-2 w-full rounded-sm placeholder:text-gray-400 placeholder:text-sm text-gray-600"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={onChangeHandler}
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-800 text-white px-4 py-2 rounded-sm w-full flex items-center justify-center disabled:bg-zinc-400 disabled:cursor-not-allowed"
            disabled={loading || !imageUrl}
          >
            {loading ? <Loading /> : "Analyze Image"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default App;
