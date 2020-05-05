class SerializerMixin(object):
    """Mixin to add serilization methods to a declarative database model

    Globals:
        restrictedData (list): list of database columns to never return

    """

    restrictedData = ['password', 'password_hash']

    @classmethod
    def passedFilter(cls, rec, filters):
        """
        Returns True if the record passed the filters otherwise returns False

        Arguments:
            record (flask_sqlalchemy.BaseQuery Object): A sqlalchemy table
                record
            filters (dict): A list of dictionaries containing a filter_field
                and a filter_val that the record must equal
        """

        failed_filters = \
            [filter_ for filter_ in filters
             if getattr(rec, filter_['filter_field']) != filter_['filter_val']]

        return len(failed_filters) == 0

    @classmethod
    def serialize_all(cls, filters=[]):
        """Serializes all records"""
        objs = []
        available_columns = cls.__serializeable__ + ['id']
        for rec in cls.query.all():
            if cls.passedFilter(rec, filters):
                record = {}
                for col in available_columns:
                    if col not in cls.restrictedData:
                        record[col] = getattr(rec, col)
                objs.append(record)
        return objs

    @classmethod
    def serialize_one(cls, id, filters=[]):
        """Serializes one record"""
        available_columns = cls.__serializeable__ + ['id']
        rec = cls.query.get(id)
        if cls.passedFilter(rec, filters):
            record = {}
            for col in available_columns:
                if col not in cls.restrictedData:
                    record[col] = getattr(rec, col)
            return record
