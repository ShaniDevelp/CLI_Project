
const CommandParser = {
  parse: async (input, setLoading) => {
    const [command, ...args] = input.trim().split(' ');
    console.log(input)
    let result = {}
    switch (command) {
      case 'help':
        result = {message: `Available commands:
        - help: Will show you all  available commands
        - about: Will Display information about this CLI
        - fetch-price [coin]: Fetch the current price of a specified cryptocurrency.
        - Example (fetch-price BTCUSDT), please add space before pair
        - upload: lets you upload any csv file 
        - draw [file] [columns]: Draws the chart of the specified columns of the file present in the backend directory.
        - Example (draw Solana.csv "Date" "Price" "Open" "High")
        - delete [file]: lets you delete any uploaded file from your upload directory
        - Example (delete Solana.csv)
        - clear: to clear all previous results
        `};
        return result
      case 'about':
        result = {message: 'This is a CLI REPL built with Next.js'}
        return result;
      case 'fetch-price':
        if (args.length < 1) {
          result = {message: 'Please provide a coin name.'}
          return result;
        }
        const coin = args[0]
        try {
          const response = await fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${coin}`);
          const data = await response.json();
          const price = parseFloat(data?.price);
          if (!isNaN(price)) {
            const formattedPrice = price.toFixed(0);
            result = {message: `The current price of ${coin} is $${formattedPrice}.`}
            return result;
          } else {
            result = {message: `Couldn't find price information for ${coin}.`}
            return result;
          }
        } catch (error) {
          result = {message: `Couldn't find price information for ${coin}.`}
          return result
        }
      case 'draw':
        if (args.length < 2) {
          result = {message: 'Please provide file name and columns.'}
          return result;
        }
        const [filename, ...columns] = args;
        setLoading(true)
        try {
          const response = await fetch(`/api/draw?filename=${filename}&columns=${columns.join(',')}`);
          const responseData = await response.json();
          if(!responseData.success){
            result = {message: `An error occurred while drawing the chart. ${responseData.error}`}
            setLoading(false)
            return result
          }
          result = {data: responseData.data, type: 'chart', message: "Drawn chart Successfully"};
          setLoading(false)
          return result;
        } catch (error) {
          console.error('Error drawing chart:', error);
          setLoading(false)
          result = {message: `An error occurred while drawing the chart. ${error}`}
          return result;
        }
      case 'upload':
        result = {message: 'upload CSV file'}
        return result
      case 'delete':
        if (args.length < 1) {
          result = {message: 'Please provide file name.'}
          return result;
        }
        const deleteFilename = args[0]
        try {
          const response = await fetch(`/api/delete?filename=${encodeURIComponent(deleteFilename)}`, { method: 'DELETE' });
          console.log(response)
          if (!response.ok) {
            result = {message: 'file not found'};
            return result
          }
          const responseData = await response.json();
          result = {message: responseData.message};
          return result;
        } catch (error) {
          result = {message: `An error occurred while deleting the file.`};
          return result;
        }
      default: 
        result = {message: `Unknown command: ${input}`};                  
        return result;
    }
  },
};

export default CommandParser;
