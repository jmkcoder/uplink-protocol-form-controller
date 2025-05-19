// Mock of @uplink-protocol/core exports
const createBindings = function(initialState: Record<string, any>) {
  const bindings: Record<string, any> = {};
  
  for (const key in initialState) {
    if (Object.prototype.hasOwnProperty.call(initialState, key)) {
      // Create a reactive binding for each property
      const binding = {
        current: initialState[key],
        _callbacks: [] as ((value: any) => void)[],
        subscribe: function(callback: (value: any) => void) {
          this._callbacks.push(callback);
          callback(this.current);
          return () => {
            this._callbacks = this._callbacks.filter(cb => cb !== callback);
          };
        },
        set: function(value: any) {
          this.current = value;
          this._callbacks.forEach(cb => cb(value));
        }
      };
      bindings[key] = binding;
    }
  }
  
  return bindings;
};

module.exports = {
  createBindings
};
