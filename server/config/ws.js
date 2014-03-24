
/* todo: use json-rpc notification schema (http://www.jsonrpc.org/specification#notification) with websockets to notify connected clients of server-side updates:
 * server --> client : {"jsonrpc": "2.0", "method": "postCreated", "params": [{"id": "123", "from": "John Doe", "message": "blah blah..."]}
 */