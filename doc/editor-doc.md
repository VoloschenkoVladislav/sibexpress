# EditorJS blocks documentation

Updated at: 2024.08.25

## 1. Main structure of editor's raw content

Editor always return JSON structure with 3 necessary fields:

| Field   |             Type               |      Description     |
|---------|--------------------------------|----------------------|
| time    | number                         | Saving timestamp     |
| blocks  | {type: string, data: object}[] | List of Blocks data  |
| version | string                         | Version of Editor.js |

Example:
```
{
  "time": 1724602422132,
  "blocks": [],
  "version": "2.30.2"
}
```

## 2. Blocks data

Blocks data using in editor's output contains 3 fields:

| Field |             Type    |      Description     |
|-------|---------------------|----------------------|
| id    | string              | Block id             |
| type  | string              | Block type           |
| data  | Object<any> or null | Block data           |

Example:
```
{
  "id": "XV87kJS_H1",
  "type": "list",
  "data": {
    "style": "unordered",
    "items": [
      "It is a block-styled editor",
      "It returns clean data output in JSON",
      "Designed to be extendable and pluggable with a simple API"
    ]
  }
}
```

## 3. Data types

### 3.1. Heading

| Field |  Type  |      Description            |
|-------|--------|-----------------------------|
| text  | string | Heading text                |
| level | number | Heading level (from 1 to 6) |

Example:
```
{
  "id": "AOulAjL8XM",
  "type": "header",
  "data": {
    "text": "What does it mean «block-styled editor»",
    "level": 3
  }
}
```

### 3.2. Paragraph

| Field |   Type  |  Description   |
|-------|---------|----------------|
| text  | string  | Paragraph text |

Example:
```
{
  "id": "zbGZFPM-iI",
  "type": "paragraph",
  "data": {
    "text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration."
  }
}
```

### 3.3. List

| Field | Type      |      Description                |
|-------|-----------|---------------------------------|
| style | string    | List style (ordered, unordered) |
| level | string[]  | List's item's text              |

Example:
```
{
  "id": "XV87kJS_H1",
  "type": "list",
  "data": {
    "style": "unordered",
    "items": [
      "It is a block-styled editor",
      "It returns clean data output in JSON",
      "Designed to be extendable and pluggable with a simple API"
    ]
  }
}
```

### 3.4. Simple image

| Field | Type      |      Description                |
|-------|-----------|---------------------------------|
| src   | string    | Source of image                 |

Example:
```
{
  "id": "f0Aaiiv45u",
  "type": "simpleImage",
  "data": {
    "src": "https://sib.express/img_posts/0/71/2_oKGXfIVcqT.jpg"
  }
}
```
