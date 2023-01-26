# Stylize WebSite

On this site you can apply styles (even your own) to any your images

## How to run on your computer
In folder ./frontend run:

```
npm install
npm start
```

Then in folder ./backend create virtual environment:

```
python -m venv venv
```

Activate environment:

```
.\venv\Script\activate
```

Then install all requirenments: 

```
pip install -r .\requirements.txt
```

And then start server on port 8000:

```
uvicorn main:app --port=8000
```

The site is now available at: "http://localhost:3000"